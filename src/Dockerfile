FROM node:16

WORKDIR /

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install
RUN sudo apt-get update
RUN apt-get install vim

COPY . .

EXPOSE 3000

CMD [ "node", "server.js" ]