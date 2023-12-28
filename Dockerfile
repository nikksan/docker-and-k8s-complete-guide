FROM node:20-alpine3.19
WORKDIR /app

COPY package*.json .
COPY src/ /app/src/

RUN apk add --no-cache curl

ARG NPM_TOKEN
RUN echo "NPM_TOKEN is $NPM_TOKEN"

RUN npm ci --omit=dev
CMD ["npm", "run", "start"]
