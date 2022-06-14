#!/bin/bash

SCRIPTPATH=$(dirname "$SCRIPT");
cd $SCRIPTPATH/electrical-webapp-frontend;
gatsby build;
cd $SCRIPTPATH;
docker-compose down;
docker-compose up -d;
