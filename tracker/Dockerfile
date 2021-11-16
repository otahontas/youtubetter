FROM node:16.13.0-alpine3.14
WORKDIR /usr/src/app
COPY --chown=node:node ./package* /usr/src/app/
RUN npm ci --production
COPY --chown=node:node . /usr/src/app/
USER node
EXPOSE 8080
CMD ["npm", "start"]
