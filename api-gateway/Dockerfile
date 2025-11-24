FROM node:20

WORKDIR /app

COPY package*.json ./
ENV NODE_ENV=production
RUN npm install --omit=dev

COPY src ./src
RUN mkdir -p uploads

EXPOSE 3000

CMD ["npm", "start"]
