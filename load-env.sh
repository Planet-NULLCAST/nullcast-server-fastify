#!/bin/bash

for line in `cat "./.env"` 
do
    export $line
done