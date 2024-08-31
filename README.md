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
