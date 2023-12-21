FROM node:20-alpine3.19
WORKDIR /app

COPY package*.json .
COPY src/ /app/src/

RUN apk add --no-cache curl

RUN npm ci --omit=dev
CMD ["npm", "run", "start:dev"]
