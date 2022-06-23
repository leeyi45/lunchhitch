# lunchhitch

## Dependencies
Node 16.15.0
### Yarn Packages
1. React

## Installation Instructions
### Preparing the Environment
1. Install [node 16.15.0](https://nodejs.org/download/release/latest-v16.x/)
2. Install `yarn` using `npm install --global yarn`

### Running the server
1. Run `yarn install` to install all necessary packages
2. Run `yarn db:update` to generate the prisma client
3. Run `yarn dev` to start the development server

## Repository Structure
```
.
├── prisma                            // Prisma configuration
│   └── prisma.schema
├── docs                              // docs submodule
├── src
│   ├── common                        // Common and reused React components go here
│   ├── pages                         // NextJS will serve these as pages on the webserver
│   │   └── api                       // NextJS API based routes
│   │       └── auth
│   │           └── [...nextAuth].ts  // NextAuth configuration
│   └── styles                        // CSS and styles go here
├── testing                           // Code used for testing
└── .eslintrc.js                      // eslint configuration

```
Generated from [here](https://tree.nathanfriend.io/)

## Docs Submodule
The documentation for this project is hosted using Github Pages [here](https://lunchhitch.github.io/lunchhitch). The source for this documentation is located in a [separate repository](https://github.com/lunchhitch/lunchhitch-docs). This repository is linked to this one as a git submodule in the `docs` folder. Do not create a folder that called `docs` in that path to make sure the folder is properly synced.
