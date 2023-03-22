# Mini-Room

<p align="center">
  <img width="350" src="https://github.com/sand050965/Mini-Room/blob/main/readme/logo.png?raw=true">
</p>
Mini Room is a video-communication service allows you to host real-time meetings online, make peer-to-peer video calls and chat in messages.
<br/>
<br/>
🔗 Website URL: https://miniroom.online/
<br/>
<br/>
📄 API Doc: https://app.swaggerhub.com/apis/SAND050965_1/mini-room_api/1.0.0
<br/>
<br/>
<b>🧑‍💻 Login with:</b>
<br/>
&nbsp; &nbsp; Test Account: test@gmail.com
<br/>
&nbsp; &nbsp; Test Password: 123456
<br/>
<br/>

## Table of Contents

- [Main Features](#main-features)
  - [Online Video Calls, Meetings and Conferencing](#online-video-calls-meetings-and-conferencing)
  - [Real-Time Messaging](#real-time-messaging)
  - [Screen Sharing and Meeting Recording](#screen-sharing-and-Meeting-recording)
  - [Hand Tracking Canvas](#ai-hand-tracking-canvas)
- [Side Features](#side-features)
- [Architecture](#architecture)
- [Database Schema](#database-schema)
- [Backend Technique](#backend-technique)
- [Frontend Technique](#frontend-technique)
- [API Doc](#api-doc)
- [Contact](#contact)

## Main Features

### Online Video Calls, Meetings and Conferencing
- Use WebRTC and PeerJS to achieve Peer-to-Peer video calls.

  ![image](https://github.com/sand050965/Mini-Room/blob/main/readme/videoCalls.gif?raw=true)

### Real-Time Messaging
- Use Socket.IO for meeting room management and real-time chat room.

  ![image](https://github.com/sand050965/Mini-Room/blob/main/readme/message.gif?raw=true)

### Screen Sharing and Meeting Recording
- Supports meeting recording and screen sharing functions.

  ![image](https://github.com/sand050965/Mini-Room/blob/main/readme/screenShare.gif?raw=true)

### AI Hand Tracking Canvas
- Use MediaPipe and OpenCV to implement this feature.

  ![image](https://github.com/sand050965/Hand-Tracking-Canvas/blob/main/readme/painting-mode.gif?raw=true)

  [(more info ...)](https://github.com/sand050965/Hand-Tracking-Canvas)

## Side Features

- Users can sign in locally or use Google OAuth 2.0.
- User authentication with Json Web Token (JWT).
- Setup CI/CD workflow with GitHub Actions, Docker Hub Webhooks and Jenkins.
- Supports invitation mail sending.
- Supports file uploading and emojis sending in chatroom.
- User can change their own avatar image.


## Architecture

### Server Architecture

![image](https://github.com/sand050965/Mini-Room/blob/main/readme/archetecture.png?raw=true)

<br/>
<br/>

### Socket Architecture

![image](https://github.com/sand050965/Mini-Room/blob/main/readme/websocket.png?raw=true)

<br/>
<br/>

### PeerJS Architecture

![image](https://github.com/sand050965/Mini-Room/blob/main/readme/peerjs.png?raw=true)

<br/>
<br/>

## Backend Technique

### Infrastructure

- Docker
- docker-compose

### Environment

- Node.js/Express.js

### Database

- MongoDB Atlas

### Cache

- Redis

### Cloud Services

- AWS EC2
- AWS CodeDeploy
- AWS ElastiCache
- AWS S3 Bucket
- AWS CloudFront

### Networking

- HTTP & HTTPS
- WebSocket
- Domain Name System (DNS)
- NGINX
- SSL (Let's Encrypt)

### CI / CD

- CI: 
  - GitHub Actions
  - Docker Hub Webhooks
  - Jenkins
- CD: 
  - AWS CodeDeploy
### Test

- Unit test: Supertest

### Third Party Library

- Socket.IO
- mongoose
- passport.js
- nodemailer
- joi.js
- multer
- aws-sdk
- bcrypt

### Version Control

- Git / GitHub
- Dcoker Hub

### Key Points

- WebSocket
- MVC Pattern

## Database Schema

![image](https://github.com/sand050965/Mini-Room/blob/main/readme/ERD.png?raw=true)

<br/>
<br/>

## Frontend Technique

- HTML, JavaScript, CSS
- WebRTC
- EJS Template

### Third Party Library

- PeerJS
- Bootstrap
- FontAwesome
- AOS
- Open Emoji API

## API Doc

[API doc](https://app.swaggerhub.com/apis/SAND050965_1/mini-room_api/1.0.0)

## Contact

🙂 Hsien-Yu, Yang
<br/>

📩 Email: sand050965@gmail.com