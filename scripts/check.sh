#!/usr/bin/env bash

if [ "$MY_SECRET" == "ubuntu" ]; then
  echo "that's the one!"
else
  echo "secret does not match"
fi