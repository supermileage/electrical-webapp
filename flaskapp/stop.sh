#!/bin/bash
app="ubcst-electrical-webapp"
docker stop $(docker ps -a -q  --filter ancestor=${app})
