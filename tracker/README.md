# Message queue tracker

Websocket server that passes messages to each of its clients with some basic error
recovery handling.

## Development

Tools you need:

- yarn or npm
- node

Install with `npm install`.

Run development version with `npm run dev`. Server now runs in port 8080.

## Production

Tools you need:

- Docker
- Docker-compose

Build and start service detached by running `docker-compose up -d`. Server starts in
localhost port 8080. When you need to build a new version, run `docker-compose build`.
