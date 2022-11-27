FROM node:14.15.4-alpine3.12

ARG ENV_FILE=.env

COPY . /app
WORKDIR /app

ADD $ENV_FILE ./.env

RUN yarn install

RUN yarn build

EXPOSE 3000

CMD [ "yarn", "start" ]
