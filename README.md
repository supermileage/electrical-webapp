# Electrical Webapp
This repo contains the source code for the interactive electrical webapp. Currently only hosting telemetry parser.

## Contents
 - [Dependencies and Prerequisites](#dependencies-and-prerequisites)
 - [Deployment](#deployment)
     - [Deploying the app on production server](#deploying-the-app-on-production-server)
 - [Development](#development)
     - [Getting started](#getting-started)
     - [Frontend development](#frontend-development)
     - [Backend development](#backend-development)

## Dependencies and Prerequisites
 - NPM
 - Gatsby-cli
    ```shell
    npm install -g gatsby-cli
    ```
 - Docker
 - Docker Compose

## Deployment
### Deploying the app on production server
1. Clone this repository
    ```shell
    git@github.com:supermileage/electrical-webapp.git
    ```
2. Rename .env.template to .env, and fill in the variables
3. Build Frontend
    ```shell
    cd electrical-webapp/electrical-webapp-frontend
    npm install
    gatsby build
    ```
4. Start docker containers
    ```shell
    cd ..
    docker-compose up
    ```

## Development
### Getting started
1. Clone this repository
    ```shell
    git@github.com:supermileage/electrical-webapp.git
    ```
2. Rename .env.template to .env, and fill in the variables

### Frontend Development

1. Install dependencies and start deployment server
    ```shell
    cd electrical-webapp/electrical-webapp-frontend
    npm install
    gatsby develop
    ```
2. View development server at [locahlhost:8000](localhost:8000)
    > changes made to the frontend code while gatsby development server is deployed will be immediately reflected in the browser without needing to refresh.

### Backend Development
1. start docker containers
    ```shell
    cd electrical-webapp
    docker-compose up -d
    ```
 - After changes are made, restart docker containers
    ```shell
    docker-compose restart
    ```
 - If docker image needs to be updated, (e.g. requirements.txt was changed), rebuild docker images
    ```shell
    docker-compose stop
    docker-compose build
    docker-compose start
    ```
 - Stop the app with
    ```shell
    docker-compose stop
    ```


Repository owner: Roy :unicorn:
