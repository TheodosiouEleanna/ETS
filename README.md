This is the app to be used in the Eye Tracking System (ETS).
A system that provides translation aid when reading text documents by utilizing real time eye tracking data.
It is being developed in the context of my Diploma Thesis.

# To run ETS locally: 

Run npm start in front-end 
Run python app.py in back-end

# To run front-end in Electron window replace start in script of package.json with this:
"start": "cross-env ELECTRON_START_URL=http://localhost:3000 electron -r ts-node/register ./src/electron.ts",

 # To run ETS with docker :

- ADD DOCKERFILES in the front-end and back-end directories

- Back-end Dockerfile:

---

FROM python:3.10.11

RUN apt-get update && apt-get install -y libavahi-client3 && rm -rf /var/lib/apt/lists/\*

RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/Users/Administrator/.cargo/bin:${PATH}"

WORKDIR /app

COPY requirements.txt requirements.txt

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["python", "app.py"]


- Front-end Dockerfile:

---

FROM node:18.16.0
WORKDIR /app
COPY package\*.json ./
RUN npm install
COPY . ./
EXPOSE 3000
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

* Flask dependency issues:
We need to resolve what dependencies are needed for the back-end

# pywin32==305

# pywinpty==2.0.10

# torchaudio==0.13.1+cu117

# torchvision==0.14.1+cu117

torchaudio==0.13.1
torchvision==0.14.1
