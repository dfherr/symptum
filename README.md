# Symptum
This is the code of the symptum application.

Symptum is an app that helps doctors make their differential diagnosis and allows the pharma industry to directly advertise new drugs.

## Setup

We use docker to guarantee the same environment across all developers. Thus no one uses different library versions across machines, including system libraries.

Furthermore we use crane to orchestrate running our docker images with the same configuration across systems.

To use this project environment you need to install docker and crane.

### Install Docker

`https://docs.docker.com/engine/installation/#supported-platforms`

For ubuntu you can go directly to: `https://docs.docker.com/engine/installation/linux/ubuntu/`

Also follow the post install steps for the docker user and auto start of docker `https://docs.docker.com/engine/installation/linux/linux-postinstall/`

### Install crane

Then install crane. See: `https://github.com/michaelsauter/crane`

### Install dependencies

As the npm packages are not commited to the git repository and docker images are mounted to the filesystem for development, you have to install the packages.

From the project root directory run:
```
cd frontend && crane run frontend npm install
cd ..
cd backend && crane run backend npm install
```

Note this step is only necessariy when we mount our local source code into the docker container during development. When running the docker container without mounting the local files, it will use the dependencies installed in the docker image. The crane configuration keyword for this is `volume`.

### Add linter to git/hooks

To guarantee a consistent coding style, please add the linter to the projects git hooks:

```
cp backend/misc/git/pre-commit .git/hooks/pre-commit
```

## How to use

### Development

The [crane.yml](crane.yml) contains the orchestration configuration for the project.

To start the backend use:

```
crane run backend
```

It will automatically start the required postgres database and persist data to the [persistence/](persistence/) subfolder.

To start the frontend use:

```
crane run frontend
```

To connect both applications, you also need to run nginx:

```
crane run nginx
```

### Production

Special production configuration is provided. The app can be deployed by using:

```
crane run production-nginx
```

This will start `postgres`, `production-backend`,`production-frontend` and `pgadmin`.

For updating production make sure to pull the new docker image and stop/remove the container that needs to be updated. Then restart nginx.

Example:
```
crane pull production-frontend
crane rm --force production frontend
crane run production-nginx
```

## Contribution

* Dennis-Florian Herr
  * Data creation and bootstrapping
  * Development & Production infrastructure
  * Backend Business logic & algorithms
  * Frontend loading spinner, 404, 500 & footer
* Ivan Chimeno
  * Frontend structure, session management and routing.
  * Login, logout, signup and doctor workflow
* Eldi Cano
  * Frontend pharma workflow
  * Frontend design
* Florian Walter
  * Backend code structure
  * Database structure
  * REST API design, request handling validation

## License

[MIT](LICENSE)

Copyright (c) 2019 Dennis-Florian Herr, Eldi Cano, Ivan Chimeno, Florian Walter

Created as part of the "SEBA Master - Web Application Engineering" 2019 @ TUM
