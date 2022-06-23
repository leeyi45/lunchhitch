Developer's Guide 

Quick links for developer's guide
=================================

*   [Tech Stack](#tech-stack)
*   [Getting started](#quickstart)

Tech Stack
----------

This section contains information on the different frameworks used by this project

### yarn

`yarn` serves as the javascript/typescript package manager for the project

### Typescript

The project is written mainly in typescript, augmenting javascript with type checking to improve the robustness of our code.

### NextJS

NextJS is a fullstack framework designed around React, allowing us to develop our project as a single server instead of a separate frontend and backend. It also comes with different integrated components, like `next/router`, saving us the hassle of installing other packages like `react-router`, and optional components, like `next-auth`, which provides authentication.

#### NextAuth

`next-auth` serves as our library for managing authentication, chosen for its integration with NextJS.

### Firebase

To avoid having to hash and store passwords ourselves and thus exposing potential security vulnerabilites, this project utilizes Firebase to manage user accounts

### MongoDB/Mongo Atlas

Our database of choice is MongoDB, hosted by MongoDB's [cloud](https://mongodb.com) services

#### Prisma

Prisma serves as an ORM for the project. Combined with typescript, it allows for rich type checking while making transactions with our database

Getting Started
---------------

### Installing Dependencies

Building the project requires NodeJS and yarn. Download NodeJS 16.15.x from [here](https://nodejs.org/download/release/latest-v16.x/)

Installing yarn is then as simple as running `npm install yarn`, with the `-g` flag if you're installing it globally

### Building the Project

First, clone the repository from [github](https://github.com/leeyi45/lunchhitch)

Enter the project directory, then run `yarn install`. This should install all the packages that the project requires

The basic repository structure is as follows:

```
.
├── prisma                       // Prisma configuration
│   └── prisma.schema
├── src
│   ├── common                   // Common and reused React components go here
│   ├── pages                    // NextJS will serve these as pages on the webserver
│   │   ├── api                  // NextJS API based routes
│   │   └── auth
│   │       └── [...nextauth].ts // NextAuth configuration
│   └── styles                   // CSS and styles go here
├── testing                      // Code used for testing
├── .eslintrc.js                 // eslint configuration
└── .env                         // Configure environment variables

```

### Environment Variables

Before starting the project, the following environment variables need to be set:

*   DATABASE\_URL
*   DATABASE\_USERNAME
*   DATABASE\_PASSWORD
