#!/bin/bash
docker network create apollo_api
if [ $? -eq 0 ]; then
    echo Created apollo_api network
else
    echo apollo_api network already exists
fi