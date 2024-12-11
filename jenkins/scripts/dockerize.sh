#!/usr/bin/env sh

set -e

echo '[info] Dockerizing ...'

echo '[info] docker compose --env-file=./.env up -d --build'
docker compose --env-file=./.env up -d --build

echo '[info] Dockerized and up !'