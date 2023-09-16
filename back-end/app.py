import io
import sqlite3
import re
import json
from flask import Flask, make_response, request, jsonify, Response
from werkzeug.security import generate_password_hash, check_password_hash
import uuid
from werkzeug.utils import secure_filename
from datetime import datetime
from flask_cors import CORS
import traceback
import tobii_research as tr
import websockets
import asyncio
import traceback
from pdf2image import convert_from_bytes
import pytesseract
from PyPDF2 import PdfReader
from concurrent.futures import ThreadPoolExecutor
from PIL import Image
from config import load_config
from functools import partial

app = Flask(__name__)
CORS(app, resources={
     r"/api/*": {"origins": ["http://localhost:3000", "http://localhost:3001"]}})
sqLiteDatabase = 'ETSsqLiteDB'

# Load the configuration values from appsettings.json
config_data = load_config()
listening_port = config_data['ETSUIConfig']['ListeningPort']
ETSDVM_address = config_data['ETSUIConfig']['ETSDVMport']

# --------------------- FUNCTIONS ---------------------------
# Maybe move them in a separate file


def get_host_and_port(address):
    # Keep IPv4 only..
    hostname = re.search(r'\b(?:\d{1,3}\.){3}\d{1,3}\b|\blocalhost\b', address)
    port = re.search(r':(\d+)', address)
    return hostname.group(), int(port.group(1))


def _build_cors_preflight_response():
    response = make_response()
    response.headers.add("Access-Control-Allow-Origin",
                         "http://localhost:3000")
    response.headers.add("Access-Control-Allow-Headers",
                         "Content-Type,Authorization")
    response.headers.add("Access-Control-Allow-Methods", "POST")
    return response


async def send_request(request_data):
    server_host, server_port = get_host_and_port(ETSDVM_address)
    async with websockets.connect(f"ws://{server_host}:{server_port}") as websocket:
        # Send the data over the WebSocket connection
        await websocket.send(request_data)
        response_data = await websocket.recv()  # Wait to receive the response
        return response_data


def upload_file(file, user_id):
    filename = secure_filename(file.filename)
    file_data = file.read()

    upload_date = datetime.now()

    conn = sqlite3.connect(sqLiteDatabase)
    c = conn.cursor()

    # Check if file with same name and user_id already exists
    c.execute("SELECT COUNT(*) FROM documents WHERE userID = ? AND docName = ?",
              (user_id, filename))
    if c.fetchone()[0] > 0:
        conn.close()
        response = {
            'message': 'File with the same name already exists.',
            'userID': user_id,
            'docName': filename,
        }
        return jsonify(response), 400

    new_id = str(uuid.uuid4())
    c.execute("""
        INSERT INTO documents(docID, userID, docName, docFile, uploadDate, lastReadPage)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (new_id, user_id, filename, file_data, upload_date, 0))
    conn.commit()
    conn.close()

    response = {
        'message': 'File uploaded and stored successfully.',
        'docID': new_id,
        'userID': user_id,
        'docName': filename,
        'uploadDate': upload_date.strftime('%Y-%m-%d %H:%M:%S')
    }
    return jsonify(response), 200

# ---------------------- API ROUTES ---------------------------------------
# Files


@app.route('/api/get_file', methods=['GET'])
def get_file():
    doc_id = request.args.get('docID')
    user_id = request.args.get('userID')
    if doc_id is None:
        return "No docID provided", 400

    conn = sqlite3.connect(sqLiteDatabase)
    c = conn.cursor()

    c.execute("SELECT * FROM documents WHERE docID = ? AND userID = ?",
              (doc_id, user_id))
    record = c.fetchone()

    if record is None:
        conn.close()
        return "No record found with the provided docID", 404

    conn.close()

    file_data = record[3]
    file_object = io.BytesIO(file_data)
    file_name = record[2]

    return Response(file_object, mimetype='application/pdf',
                    headers={"Content-Disposition": f"attachment;filename={file_name}"})


@app.route('/api/upload_file', methods=['POST'])
def parse_file():
    print(request.form)  # Debugging line
    user_id = request.form.get('userID', default=1)
    if 'file' not in request.files:
        return "No file part", 400
    file = request.files['file']

    if file.filename == '':
        return "No selected file", 400
    if file:
        print('file', file)
        response = upload_file(file, user_id)
        return response
    else:
        return "Allowed file type only.", 415


@app.route('/api/delete_file', methods=['DELETE'])
def delete_file():
    doc_id = request.args.get('docID')
    user_id = request.args.get('userID')

    if not doc_id:
        return "docID required", 400

    # Assumes remove_file function does the deletion logic
    response = remove_file(doc_id, user_id)
    return response


def remove_file(doc_id, user_id):
    # Logic to remove the file metadata from the database based on doc_id and user_id
    # Logic to delete the actual file from the file system

    conn = sqlite3.connect(sqLiteDatabase)
    c = conn.cursor()

    # Check if the file with given doc_id and user_id exists
    c.execute("SELECT COUNT(*), docName FROM documents WHERE docID = ? AND userID = ?",
              (doc_id, user_id))
    row = c.fetchone()

    if row[0] == 0:
        conn.close()
        response = {
            'message': 'File not found or unauthorized.',
            'docID': doc_id,
            'userID': user_id
        }
        return jsonify(response), 404

    c.execute("DELETE FROM documents WHERE docID = ? AND userID = ?",
              (doc_id, user_id))
    conn.commit()
    conn.close()

    response = {
        'message': 'File deleted successfully.',
        'docID': doc_id,
        'userID': user_id
    }
    return jsonify(response), 200


@app.route('/api/documents', methods=['GET'])
def get_documents():
    try:
        user_id = request.args.get('userID')

        conn = sqlite3.connect(sqLiteDatabase)
        conn.row_factory = sqlite3.Row
        c = conn.cursor()

        c.execute(
            "SELECT docID, userID, docName, uploadDate, lastReadPage FROM documents WHERE userID=?", (user_id,))

        documents = c.fetchall()
        print(documents)
        documents_list = [dict(row) for row in documents]
        print(documents_list)
        return jsonify(documents_list)
    except Exception as e:
        print(traceback.format_exc())  # This will print the full traceback
        return jsonify({"error": str(e)}), 500


def process_page(page_image):
    words_with_positions = []
    data = pytesseract.image_to_data(
        page_image, output_type=pytesseract.Output.DICT)
    # print(data)
    words = data['text']
    confidences = data['conf']
    boxes = zip(data['left'], data['top'], data['width'], data['height'])

    for word, confidence, box in zip(words, confidences, boxes):
        if int(confidence) > 30:
            words_with_positions.append(
                {"word": word, "confidence": confidence, "box": box})

    return words_with_positions


def resize_pil_image(image, scaling_factor):
    original_width, original_height = image.size
    new_width = int(original_width * scaling_factor)
    new_height = int(original_height * scaling_factor)

    resized_image = image.resize((new_width, new_height), Image.ANTIALIAS)

    return resized_image


def process_single_page(page_num, pdf_content=None, scaling_factor=1.0, ):
    final_scale_factor_width = scaling_factor * 1.1613269613269613
    final_scale_factor_height = scaling_factor * 1.1616161616161617
    page_images = convert_from_bytes(
        pdf_content, first_page=page_num + 1, last_page=page_num + 1
    )

    if page_images:
        original_image = page_images[0]

        if scaling_factor != 1:
            scaled_image = original_image.resize(
                (int(original_image.width * final_scale_factor_width),
                 int(original_image.height * final_scale_factor_height)),
                Image.ANTIALIAS
            )

            processed_image = scaled_image
            print(page_num, 'SCALED IMAGEEEEEE', scaled_image)
        else:
            processed_image = original_image

        return {"page": page_num, "data": process_page(processed_image)}


memo_object = {}
previous_zoom = 0


@app.route('/api/words-positions', methods=['GET'])
def get_position_of_words():
    try:
        doc_id = request.args.get('docID')
        user_id = request.args.get('userID')
        conn = sqlite3.connect(sqLiteDatabase)
        conn.row_factory = sqlite3.Row
        c = conn.cursor()

        memo_key = f"{doc_id}_{user_id}"

        # Fetch zoomLevel from user_settings
        c.execute(
            "SELECT zoomLevel FROM user_settings WHERE userID = ?", (user_id,))
        settings_row = c.fetchone()
        if settings_row:
            scaling_factor = settings_row['zoomLevel'] / 1.0
            previous_zoom = settings_row['zoomLevel']
        else:
            scaling_factor = 1.0  # default value
        print(scaling_factor)

        # if (memo_key in memo_object) and (previous_zoom == scaling_factor):
        #     return jsonify({"success": True, "data": memo_object[memo_key]})

        c.execute(
            "SELECT docFile FROM documents WHERE docID = ? AND userID = ?", (doc_id, user_id))
        row = c.fetchone()

        if row:
            pdf_content = row['docFile']
            pdf_reader = PdfReader(io.BytesIO(pdf_content))

            all_pages_data = []

            partial_process_single_page = partial(
                process_single_page, pdf_content=pdf_content, scaling_factor=scaling_factor)

            with ThreadPoolExecutor() as executor:
                all_pages_data = list(executor.map(
                    partial_process_single_page, range(len(pdf_reader.pages))))

            memo_object[memo_key] = all_pages_data

            return jsonify({"success": True, "data": all_pages_data})

        else:
            return jsonify({"success": False, "message": "Document not found"})

    except Exception as e:
        print(traceback.format_exc())
        return jsonify({"success": False, "message": "An error occurred"})


@app.route('/api/search', methods=['POST'])
def search_eye_tracker():
    request_data = {
        "action": "search_eye_tracker"
    }

    # Convert the dictionary to a JSON string for sending the request
    request_json = json.dumps(request_data)

    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    response_data = loop.run_until_complete(send_request(request_json))

    # Convert JSON string to a Python dictionary or list. The returned type of response_data must be string.
    return json.loads(response_data)


@app.route('/api/connect', methods=['POST'])
def get_eye_tracker():
    data = request.get_json()

    address = data['address']
    print("I arrived: ", address)
    request_data = {
        "action": "connect_to_tracker",
        "address": address
    }
    request_json = json.dumps(request_data)

    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    response_data = loop.run_until_complete(send_request(request_json))

    try:
        response_dict = json.loads(response_data)
        message = response_dict.get('message', 'Unknown status')
    except json.JSONDecodeError:
        message = 'Invalid response format'

    return jsonify({"message": message}), 200

# User profile


@app.route('/api/create-profile', methods=['POST'])
def create_profile():
    data = request.get_json()

    username = data['username']

    if len(username) < 6:
        return jsonify({'message': 'Username should be at least 6 characters.'}), 400

    if len(data['password']) < 6:
        return jsonify({'message': 'Password should be at least 6 characters.'}), 400

    conn = sqlite3.connect(sqLiteDatabase)
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM users WHERE username = ?", (username,))
    user = cursor.fetchone()
    print(user)

    if user:
        return jsonify({'message': 'Username already exists.'}), 400

    password = generate_password_hash(data['password'], method='sha256')

    cursor.execute("INSERT INTO users (userID, username, password) VALUES (?, ?, ?)",
                   (str(uuid.uuid4()), username, password))
    conn.commit()

    return jsonify({'message': 'New user created.'}), 200


@app.route('/api/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()
    data = request.get_json()

    username = data['username']
    password = data['password']

    conn = sqlite3.connect(sqLiteDatabase)
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM users WHERE username=?", (username,))
    user = cursor.fetchone()

    if user is None:
        return jsonify({'message': 'Invalid username and password.'}), 400

    if not check_password_hash(user[2], password):
        return jsonify({'message': 'Invalid password.'}), 400

    return jsonify({
        'message': 'Logged in successfully.',
        'username': user[1],
        'userID': user[0]
    }), 200

# Settings


@app.route('/api/settings', methods=['POST'])
def update_settings():
    data = request.get_json()

    userID = data['userID']
    selected_language = data['language']
    theme = data['theme']
    zoomLevel = data['zoomLevel']

    conn = sqlite3.connect(sqLiteDatabase)
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM user_settings WHERE userID = ?", (userID,))
    user_settings = cursor.fetchone()

    if user_settings:
        cursor.execute("UPDATE user_settings SET Selected_language = ?, theme = ?, zoomLevel = ? WHERE userID = ?",
                       (selected_language, theme, zoomLevel, userID))
    else:
        cursor.execute("INSERT INTO user_settings (userID, Selected_language, theme, zoomLevel) VALUES (?, ?, ?, ?)",
                       (userID, selected_language, theme, zoomLevel))
    conn.commit()

    return jsonify({'message': 'Settings updated.'}), 200


@app.route('/api/get_settings', methods=['GET'])
def get_user_settings():
    userID = request.args.get('userID')

    # Ensure userID is provided
    if not userID:
        return jsonify({'message': 'userID is required.'}), 400

    conn = sqlite3.connect(sqLiteDatabase)
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM user_settings WHERE userID = ?", (userID,))
    user_settings = cursor.fetchone()

    if not user_settings:
        return jsonify({'message': 'No settings found for this userID.'}), 404

    # Parsing the fetched data into a dictionary
    settings = {
        "userID": user_settings[0],
        "selected_language": user_settings[1],
        "theme": user_settings[2],
        "zoomLevel": user_settings[3]
    }

    return jsonify(settings), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=listening_port, debug=True)
