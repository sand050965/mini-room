# Mini-Room

<p align="center">
  <img width="350" src="https://github.com/sand050965/Mini-Room/blob/main/readme/logo.png?raw=true">
</p>
Mini Room is a video-communication service allows you to host real-time meetings online, make peer-to-peer video calls and chat in messages.
<br/>
<br/>
🔗Website URL: https://miniroom.online/
<br/>
<br/>
Test account: test@gmail.com
Test password: 123456
<br/>
<br/>

  ![image](https://github.com/sand050965/Mini-Room/blob/main/readme/index.png?raw=true)

  ![image](https://github.com/sand050965/Mini-Room/blob/main/readme/premeeting.png?raw=true)
  
  ![image](https://github.com/sand050965/Mini-Room/blob/main/readme/meeting-room.png?raw=true)

## Table of Contents

- [Main Features](#main-features)
- [Architecture](#architecture)
- [Database Schema](#database-schema)
- [Backend Technique](#backend-technique)
  - [Infrastructure](#infrastructure)
  - [Environment](#environment)
  - [Database](#database)
  - [Cache](#cache)
  - [Cloud Services](#cloud-services)
  - [Networking](#networking)
  - [CI / CD](#ci--cd)
  - [Test](#test)
  - [Third Party Library](#third-party-library)
  - [Version Control](#version-control)
  - [Key Points](#key-points)
- [Frontend Technique](#frontend-technique)
  - [WebRTC](#webrtc)
  - [PeerJS](#peerjs)
  - [EJS Template](#ejs-template)
  - [Bootstrap](#bootstrap)
  - [Third-Party Library](#third-party-library)
- [API Doc](#api-doc)
- [Contact](#contact)

## Main Features

- Use Socket.IO for meeting room management and real-time chat room.
- Use WebRTC and PeerJS to achieve Peer-to-Peer video calls.
- Users can sign in locally or use Google OAuth 2.0.
- User authentication with Json Web Token.
- Setup CI/CD workflow with GitHub Actions, Docker Hub Webhooks and Jenkins.
- Supports meeting recording and screen sharing functions.
- Supports invitation mail sending.
- Supports file uploading and emojis sending in chatroom.
- User can change their own avatar image.
- [Supports Hand Tracking Canvas. (more info ...)](https://github.com/sand050965/Hand-Tracking-Canvas)

![image](https://github.com/sand050965/Hand-Tracking-Canvas/blob/main/readme/painting-mode.gif?raw=true)

## Architecture

- Server Architecture

  ![image](https://github.com/sand050965/Mini-Room/blob/main/readme/archetecture.png?raw=true)

<br/>
<br/>

- Socket Architecture

  ![image](https://github.com/sand050965/Mini-Room/blob/main/readme/websocket.png?raw=true)

<br/>
<br/>

- PeerJS Architecture

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
- CD: 
  - Jenkins
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

![image](https://github.co)

<br/>
<br/>

## Frontend Technique

### WebRTC

- simply get client's video stream, and secure voice and video calls.voice and video encryption.
### PeerJS

- simplifies WebRTC peer-to-peer video transfer. 
### EJS Template

- simply create template and generate HTML markup with plain JavaScript.

### Bootstrap

- easy initiation and highly customizable, and

### Third Party Library

- FontAwesome
- AOS
- Open Emoji API

## API Doc

[API doc](https://app.swaggerhub.com/apis/SAND050965_1/mini-room_api/1.0.0)

## Contact

Hsien-Yu, Yang
<br/>

Email: sand050965@gmail.com