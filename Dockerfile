# Use a imagem Node.js como base
FROM node:18
WORKDIR /app
COPY . /app

RUN npm install
RUN npm run build

CMD ["npm", "start"]
