#!/usr/bin/env sh

set -e

echo '[info] Killing existing listening port process ...'

source ./.env || echo '[warn] Failed to read .env, fallback to default.'

echo '[info] Finding localhost 0.0.0.0 TCP listening PORT =' ${PORT:-3000}
portPID=$(netstat -ano | grep "LISTENING" | grep "TCP" | awk '{print $2,$NF}' | grep "0.0.0.0" | grep ":${PORT:-3000}" | awk '{print $NF}' | sort -u)

if [[ -z "${portPID}" ]]; then 
    echo '[info] No existing listening port process found !'
else 
    echo '[info] Found existing listening port process:' ${portPID}
    taskkill -F -PID ${portPID} || echo '[warn] Failed to kill process, might be due to the process is not running.'
fi

echo 'Kill Completed !'