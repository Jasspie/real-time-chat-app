# Overview

Real time chat application built using React.js, Node.js and gRPC. Followed https://daily.dev/blog/build-a-chat-app-using-grpc-and-reactjs.

<img width="1460" alt="image" src="https://github.com/user-attachments/assets/f9a7b759-2c79-4ed2-8da0-39aece37c3f6">

# Setup

To setup the server, run the following in the server folder:
- `docker build -t grpc-web-react .`
- `docker run -d --name grpc-web-react -p 8080:8080 -p 9901:9901 grpc-web-react`
- `npm install`
- `node server`

To setup the client, run the following in the client folder:
- `npm install`
- `npm start`

