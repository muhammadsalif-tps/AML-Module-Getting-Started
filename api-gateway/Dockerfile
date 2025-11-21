FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY src ./src
COPY uploads ./uploads

EXPOSE 3000

CMD ["npm", "start"]
