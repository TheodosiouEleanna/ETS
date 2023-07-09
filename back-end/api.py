import io
import os
import sqlite3
from flask import Flask, request, jsonify, Response
from werkzeug.utils import secure_filename
from datetime import datetime
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
sqLiteDatabase = 'ETSsqLiteDB'


@app.route('/get_file', methods=['GET'])
def get_file():
    doc_id = request.args.get('docID')
    if doc_id is None:
        return "No docID provided", 400

    conn = sqlite3.connect(sqLiteDatabase)
    c = conn.cursor()

    c.execute("SELECT * FROM documents WHERE docID = ?", (doc_id,))
    record = c.fetchone()

    if record is None:
        conn.close()
        return "No record found with the provided docID", 404

    conn.close()

    file_data = record[3]
    file_object = io.BytesIO(file_data)
    file_name = record[2]

    return Response(file_object, mimetype='application/pdf', headers={"Content-Disposition": f"attachment;filename={file_name}"})


def upload_file(file, user_id):

    filename = secure_filename(file.filename)
    file_data = file.read()

    upload_date = datetime.now()

    conn = sqlite3.connect(sqLiteDatabase)
    c = conn.cursor()

    c.execute("SELECT MAX(docID) FROM documents")
    max_id = c.fetchone()[0]
    new_id = max_id + 1 if max_id else 1
    print('new id', new_id, 'user id', user_id, 'file name',
          filename,  'upload date', upload_date)
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


@app.route('/upload_file', methods=['POST'])
def parse_file():
    if 'file' not in request.files:
        return "No file part", 400
    file = request.files['file']
    user_id = request.form.get('userID', 1)
    if file.filename == '':
        return "No selected file", 400
    if file:
        print('file', file)
        response = upload_file(file, user_id)
        return response
    else:
        return "Allowed file type only.", 415


if __name__ == '__main__':

    app.run(debug=True)
