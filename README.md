# DevGrid Weather API

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Install Docker](https://docs.docker.com/engine/install/)

### Installing

First, you will need to copy the .env.example to .env in the root directory

```
cp .env.example .env
```

After input/check the correct values at .env, on the root directory, run the Docker
Note that the .env.example file already has a configuration values that you can use. Feel free to change it.

```
docker-compose up -d
```

### Tests

To run tests, you have two options.

First, to run tests outside of the docker container, use
```
docker-compose run devgrid-api yarn test
```

Second, to run tests inside of the docker container, use
```
docker-compose up -d
docker exec -it devgrid-api /bin/sh
yarn test
```

## Built With

* [NodeJS](https://nodejs.org/)
* [Docker](https://www.docker.com/)
* [JEST](https://jestjs.io/)
