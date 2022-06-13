#!/bin/bash
app="ubcst-electrical-nginx-reverse-proxy"
docker build -t ${app} .
docker run --rm -d -p 80:80 \
  --name=${app} ${app}