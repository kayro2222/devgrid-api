FROM node:lts-alpine

RUN mkdir /app/

WORKDIR /app

COPY package.json yarn.* ./

RUN yarn

COPY . .

EXPOSE 3333

CMD ["yarn", "start"]
