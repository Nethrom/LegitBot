FROM node:10
WORKDIR /legit-bot
ADD package.json /legit-bot
RUN npm install
COPY . .
CMD [ "npm", "start" ]