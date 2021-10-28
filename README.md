# Homework 3. Jokes Server Application with GraphQL and authorization

## Features
* GraphQL (/graphql)
* Jokes query
* Registration and authorization with JWT (accessToken and refreshToken)
* Guard
* Validation

## Keys generation commands (put keys in 'jokes-server-app/assets' folder)
```bash
ssh-keygen -t rsa -b 4096 -m PEM -f private.key
openssl rsa -in private.key -pubout -outform PEM -out public.key
```

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```