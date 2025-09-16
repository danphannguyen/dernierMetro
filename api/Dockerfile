FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

HEALTHCHECK --interval=30s --timeout=30s --retries=3 CMD [ "executable" ]

RUN npm install

COPY . .

EXPOSE $PORT

CMD ["node", "server.js"]
