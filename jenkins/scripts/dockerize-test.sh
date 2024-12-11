#!/usr/bin/env sh

set -e

echo '[info] Dockerizing test ...'

echo '[info] docker compose -f ./compose-test.yaml --env-file=./.env up -d --build'
docker compose -f ./compose-test.yaml --env-file=./.env up -d --build

echo '[info] Dockerized test and up !'

echo '[info] docker compose down'
docker compose -f ./compose-test.yaml --env-file=./.env down

echo '[info] Dockerized test shutdown !'