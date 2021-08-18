#!/bin/bash

echo "\n Checking if dist already exist..."
if [ -d "./" ]; then
    printf '%s\n' "Removing bundle..."
    rm -rf "dist"
fi

echo "\n Done!"

mkdir "dist"

echo "Copying app to dist..."
cp -r ./build ./dist
