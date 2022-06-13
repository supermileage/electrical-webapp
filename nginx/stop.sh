#!/bin/bash
app="ubcst-electrical-nginx-reverse-proxy"
docker stop $(docker ps -a -q  --filter ancestor=${app})