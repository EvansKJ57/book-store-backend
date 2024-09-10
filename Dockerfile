FROM node:lts-alpine

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build

RUN rm -rf ./src

CMD [ "node", "dist/main" ]
