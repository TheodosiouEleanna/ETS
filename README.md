This is the app to be used in the Eye Tracking System (ETS).
A system that provides translation aid when reading text documents by utilizing real time eye tracking data.
It is being developed in the context of my Diploma Thesis.

To run front-end in Electron window replace start in script of package.json with this:
"start": "cross-env ELECTRON_START_URL=http://localhost:3000 electron -r ts-node/register ./src/electron.ts",

To run ETS with docker :

- ADD DOCKERFILES in the front-end and back-end directories

- Back-end Dockerfile:

---

# Use an official Python runtime as the base image

FROM python:3.10.11

# Install dependencies

RUN apt-get update && apt-get install -y libavahi-client3 && rm -rf /var/lib/apt/lists/\*

# Install Rust and Cargo using Rustup

RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/Users/Administrator/.cargo/bin:${PATH}"

# Set the working directory in the container

WORKDIR /app

# Copy the requirements file into the container

COPY requirements.txt requirements.txt

# Install any needed packages specified in requirements.txt

RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code into the container

COPY . .

# Expose the port your Flask app runs on

EXPOSE 5000

# Specify the command to run your Flask app

CMD ["python", "app.py"]

- Front-end Dockerfile:

---

# Set the base image

FROM node:18.16.0

# Set the working directory

WORKDIR /app

# Copy package.json and package-lock.json

COPY package\*.json ./

# Install dependencies

RUN npm install

# Copy the rest of your app's source code

COPY . ./

# Expose port 3000

EXPOSE 3000

# Serve the app

CMD ["npm", "start"]

- ADD docker-compose.yml in the root directory of ETS

---

version: "3"
services:
localhost:
build:
context: ./back-end
dockerfile: Dockerfile
image: localhost
ports: - "5000:5000"
react-app:
build:
context: ./front-end
dockerfile: Dockerfile
image: react-app
ports: - "3000:3000"
depends_on: - localhost
networks:
default:
driver: bridge

- RUN docker-compose up --build

--------------------------------||------------------------------------
Flask dependency issues:
We need to resolve what dependencies are needed for the back-end

# pywin32==305

# pywinpty==2.0.10

# torchaudio==0.13.1+cu117

# torchvision==0.14.1+cu117

torchaudio==0.13.1
torchvision==0.14.1
