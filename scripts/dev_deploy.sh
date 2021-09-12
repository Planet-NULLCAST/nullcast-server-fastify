#! /bin/bash

echo "Starting deployment"
DIR="/home/ubuntu/fastify"
cd $DIR
if ! git pull origin development; then
  echo "Failed to pull"
  exit 1
else
  cd $DIR
  echo "Killing Server"
  pm2 stop fastify-server
  echo "Deploying client"
  echo "Installing packages"
  if ! npm install; then
    echo "Failed to install packages"
    exit 1
  fi
  echo "Running build"
  if ! npm run build; then
    echo "Build failed !"
    exit 1
  fi
  cd $DIR
  echo "Deploying server"
  echo "Installing packages"
  if ! npm install; then
    echo "Failed to install packages"
    exit 1
  fi
  cd $DIR
  echo "Deploying video server"
  echo "Installing packages"
  if ! npm install; then
    echo "Failed to install packages"
    exit 1
  fi
  if ! pm2 start fastify-server; then
    echo "Pm2 deployment failed!"
    exit 1
  else
    echo "Deploy script finished execution"
    exit 0
  fi
fi
