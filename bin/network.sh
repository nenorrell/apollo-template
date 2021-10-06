#!/bin/bash
docker network create stonks-network
if [ $? -eq 0 ]; then
    echo Created stonks-network network
else
    echo stonks-network network already exists
fi