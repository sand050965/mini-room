# Mini-Room

# Co-Edit

<p align="center">
  <img width="350" src="https://github.com/jenniehuang/Co-Edit/blob/master/co-edit.png?raw=true">
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

![image](https://github.com/)

## Table of Contents

- [Main Features](#main-features)
- [Backend Technique](#backend-technique)
  - [Infrastructure](#infrastructure)
  - [Environment](#environment)
  - [Database](#database)
  - [Cache](#cache)
  - [Cloud Services](#cloud-services)
  - [Networking](#networking)
  - [CI / CD](#ci-cd)
  - [Test](#test)
  - [Third Party Library](#third-party-library)
  - [Version Control](#version-control)
  - [Key Points](#key-points)
- [Architecture](#architecture)
- [Database Schema](#database-schema)
- [Frontend Technique](#frontend-technique)
  - [WebRTC](#webrtc)
  - [PeerJS](#peerjs)
  - [EJS Template](#ejs-template)
  - [Bootstrap](#bootstrap)
  - [Third-Party Library](#third-party-library)
- [API Doc](#api-doc)
- [Contact](#contact)

## Main Features

- Users can sign in locally or use Google OAuth 2.0.
- User authentication with Json Web Token.
- Use socket.io for real time co-editing.
- Supports English and Chinese.
- Setup CICD pipeline with cloudbuild cloud pub/sub.
- Differentiate every user with different colors in editor.
- Supports mobile devices so you can update content anytime anywhere.
- Only host can grant or remove access to your documents.
- Supports exporting your documents as PDF files.
- Hosting images on firebase storage.

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

- socket.io
- MVC Pattern

## Architecture

- Server Architecture

  ![image](https://github.com)

- Socket Architecture

  ![image](https://github.com/)

## Database Schema

![image](https://github.co)

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