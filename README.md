# Youtubetter
## Distributed Systems Fall 2021

Note: local testing requires Docker and Docker compose. See install instructions https://docs.docker.com/get-docker/

Clone the repo:

```
git clone https://github.com/otahontas/youtubetter.git
cd youtubetter
```

## Start tracker

Open a terminal:

```bash
cd tracker
docker-compose up
```

## Start client

Open new terminal:
```bash
cd tracker
npm start
```

## Usage

Browse to:
http://localhost:3000

Press play and enjoy. Open multiple browser windows and see the magic of videos synchronizing together. Press pause and all the videos will pause in the same time.
