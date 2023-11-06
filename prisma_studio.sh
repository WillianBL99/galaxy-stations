#!/usr/bin/env bash
container_id=$(docker ps -a | grep galaxy-stations_app | 
awk '{print $1}')
if [ -z "$container_id" ]; then
  echo "Container not found"
  exit 1
fi
docker exec -it $container_id npx prisma studio