FROM node:16.13.0-alpine3.14
WORKDIR /usr/src/app
COPY --chown=node:node ./package* /usr/src/app/
RUN npm ci --production
COPY --chown=node:node . /usr/src/app/
RUN npm run build && npm install -g serve@12.0.0 && chown -R node:node /usr/src/app/build
USER node
EXPOSE 5000
CMD ["serve", "--single", "--listen", "5000", "build"]
