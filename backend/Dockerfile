FROM node:12-slim
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production
COPY dist/ .
EXPOSE 8080
CMD ["node", "index.js"]