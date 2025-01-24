FROM node
WORKDIR /app
COPY package.json /app
RUN mkdir -p /app/uploads && chown -R node:node /app/uploads
RUN npm install
COPY . /app