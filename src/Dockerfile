FROM node:16

WORKDIR /

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

COPY . .

EXPOSE 3000

EXPOSE 6379

CMD [ "node", "server.js" ]