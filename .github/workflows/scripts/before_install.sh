#! /bin/bash

# Download node, npm and yarn
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
. ~/.nvm/nvm.sh
nvm install node
npm i -g yarn

# Create the working directory if it doesn't exist yet
DIR="/home/ubuntu/fastify"
if [-d "$DIR"]; then
    echo "${DIR} exists"
else
    echo "Creating ${DIR} directory"
    mkdir ${DIR}
fi
