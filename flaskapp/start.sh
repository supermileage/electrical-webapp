#!/bin/bash
app="ubcst-electrical-webapp"
docker build -t ${app} .
docker run --rm -d -p 5000:5000 \
  --name=${app} \
  -v $PWD:/app ${app}
