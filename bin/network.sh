#!/bin/bash
docker network create apollo-api
if [ $? -eq 0 ]; then
    echo Created apollo-api network
else
    echo apollo-api network already exists
fi