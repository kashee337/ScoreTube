FROM node:12.16.1

WORKDIR /usr/app
COPY package.json package-lock.json /usr/app/

RUN npm install
COPY src /usr/app/src
COPY public/ /usr/app/public
EXPOSE 3000
CMD [ "npm","run","start" ]