This is the fastify server for nullcast

> This documentation is work in progress

## Pre-requisites
1. Must have nodejs version 12.x.x or greater
2. Must have postgres database server running locally

## Initial set up
1. Copy and rename the `env.example` file to `.env`.
2. Change the values of `.env` as per your need.
3. Create a database instance for the app and add it's creds to the `.env`.
4. R `yarn` to install the dependencies.
5. Run `yarn init-tables` to provision the tables and initial seed data.
6. Run `yarn dev` to fire up the server