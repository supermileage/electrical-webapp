# Electrical Webapp
This repo contains the source code for the interactive electrical webapp. Currently only hosting telemetry parser.

## Development
### Dependencies and Prerequisites
 - NPM
 - Docker
 - Docker Compose

### Running the app
1. Clone this repository
    > $ git clone git@github.com:supermileage/electrical-webapp.git
2. Rename .env.template to .env, and fill in the variables
3. Start docker containers
    > $ cd electrical-webapp <br>
    $ docker-compose up

### Rebuilding the app
If any changes are made that require the docker container to be rebuilt, rebuild using docker-compose

    > $ docker-compose build

### Terminating the app
Terminate the app with docker-compose

    > $ docker-compose stop
