[![@coreui angular](https://img.shields.io/badge/@coreui%20-angular-lightgrey.svg?style=flat-square)](https://github.com/coreui/angular)
[![npm-coreui-angular][npm-coreui-angular-badge]][npm-coreui-angular]
[![npm-coreui-angular][npm-coreui-angular-badge-next]][npm-coreui-angular]
![angular](https://img.shields.io/badge/angular-^18.2.0-lightgrey.svg?style=flat-square&logo=angular)

[npm-coreui-angular]: https://www.npmjs.com/package/@coreui/angular

[npm-coreui-angular-badge]: https://img.shields.io/npm/v/@coreui/angular.png?style=flat-square

[npm-coreui-angular-badge-next]: https://img.shields.io/npm/v/@coreui/angular/next?style=flat-square&color=red

[npm-coreui-angular-download]: https://img.shields.io/npm/dm/@coreui/angular.svg?style=flat-square

[npm-coreui]: https://www.npmjs.com/package/@coreui/coreui

[npm-coreui-badge]: https://img.shields.io/npm/v/@coreui/coreui.png?style=flat-square

[npm-coreui-download]: https://img.shields.io/npm/dm/@coreui/coreui.svg?style=flat-square

## Aptar Hazard Detection

Aptar Hazard Detection is the front-end application for a system designed to detect hazards within Aptar plants. The application leverages Angular 18 and CoreUI to provide a responsive interface for monitoring and managing hazard detection. 

- [CoreUI Angular Docs](https://coreui.io/angular/docs/)

## Table of Contents

- [Aptar Hazard Detection](#aptar-hazard-detection)
- [Table of Contents](#table-of-contents)
- [Quick Start](#quick-start)
    - [Prerequisites](#prerequisites)
        - [Node.js](#nodejs)
        - [Angular CLI](#angular-cli)
  - [Setup project](#setup-project)
  - [Installation](#installation)
  - [Basic usage](#basic-usage)
    - [Build](#build)
- [What's included](#whats-included)
- [Running the app with Docker](#running-the-app-with-docker)
- [Prerequisites](#prerequisites-1)
- [Instructions](#instructions)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Build the Angular Application](#2-build-the-angular-application)
  - [3. Run the Docker Container](#3-run-the-docker-container)
  - [4. Access the Application](#4-access-the-application)
- [Troubleshooting](#troubleshooting)


## Quick Start

- Clone the repo: `git clone https://github.com/mariamaOlive/ediss-internship-frontend`

#### <i>Prerequisites</i>

Before you begin, make sure your development environment includes `Node.js®` and an `npm` package manager.

###### Node.js

[**Angular 18**](https://angular.io/guide/what-is-angular) requires `Node.js` LTS version `^18.19` or `^20.11`.

- To check your version, run `node -v` in a terminal/console window.
- To get `Node.js`, go to [nodejs.org](https://nodejs.org/).

###### Angular CLI

Install the Angular CLI globally using a terminal/console window.

```bash
npm install -g @angular/cli
```

### Setup project
After cloning project and installing angular you should navigate into the cloned project directory:

``` bash
cd ediss-internship-frontend
```

### Installation

``` bash
npm install
npm update
```

### Basic usage

``` bash
# dev server with hot reload at http://localhost:4200
npm start
```

Navigate to [http://localhost:4200](http://localhost:4200). The app will automatically reload if you change any of the source files.

#### Build

Run `build` to build the project. The build artifacts will be stored in the `dist/` directory.

```bash
# build for production with minification
npm run build
```

## What's included

Within the project you'll find the following directories and files, logically grouping common assets and providing both compiled and minified variations.
You'll see something like this:

```
ediss-internship-frontend
├── src/                         # project root
│   ├── app/                     # main app directory
|   │   ├── core/                # core functionality of the app
|   |   |   ├── models/          # data models used across the app
|   |   |   ├── config/          # configuration files
|   |   |   └── services/        # Angular services for business logic
|   │   ├── environment/         # environment-specific settings
|   │   ├── icons/               # icons set for the app
|   │   ├── layout/              # layout components
|   |   │   └── default-layout/  # default layout components
|   |   |       └── _nav.js      # sidebar navigation config
|   │   ├── shared/              # shared components for reuse
|   │   ├── views/               # application views
|   |  
│   ├── assets/                  # images, icons, etc.
│   ├── scss/                    # scss styles
│   └── index.html               # main HTML template
│
├── angular.json                 # Angular CLI configuration
├── README.md                    # project README file
└── package.json                 # npm package file

```


## Running the app with Docker

This repository contains an Angular application that can be run inside a Docker container using Nginx. Follow the steps below to run and serve the app.

## Prerequisites

Before getting started, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (for building the Angular app)
- [Angular CLI](https://angular.io/cli) (optional, if not installed globally)
- [Docker](https://www.docker.com/products/docker-desktop) (for containerization)

## Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/mariamaOlive/ediss-internship-frontend
cd ediss-internship-frontend
```

### 2. Build the Angular Application

Before creating a docker image, it is necessary to build the Angular application for production:

```bash
ng build --configuration production
```

This will create the production-ready build files in the `dist/aptar-hazard-detection` folder.

### 3. Run the Docker Container

To run the container, map the container's port to your host machine's port. In this example, we'll map port `8080`:

```bash
docker run -d -p 8080:8000 angular-app
```

### 4. Access the Application

Once the container is running, you can access the Angular app in your browser at:

```
http://localhost:8080
```

If you're running Docker on a remote server, replace `localhost` with your server's IP address:

```
http://<your-server-ip>:8080
```

## Troubleshooting

- **Port Conflicts**: If port `8080` is already in use, change the port mapping in the `docker run` command. For example, to use port `9090`:

  ```bash
  docker run -d -p 9090:8080 angular-app
  ```

- **Nginx Configuration Issues**: If you see the default Nginx page, make sure that the `dist/aptar-hazard-detection` folder exists and was copied correctly during the build process.
