#!/bin/bash

echo "\n Checking if directories already exist..."
if [ -d "./build" ]; then
    printf '%s\n' "Removing build..."
    rm -rf "build"
fi

echo "\n Done!"
