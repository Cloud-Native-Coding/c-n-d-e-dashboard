FROM node:13-alpine

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm ci --only=production

COPY . .

RUN npm run build

ENTRYPOINT [ "npm", "run" ]

CMD [ "start" ]

