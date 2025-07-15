CRM Mail Dispatcher
============

This is a Customer Relationship Management (CRM) system to help you manage customer contacts efficiently.  It offers user authentication, contact management, and personalized bulk email sending, where each recipient is greeted by their first name to maintain professionalism while adding a personal touch.

<!-- ![Chat Preview](img) -->

## Features
- **User Authentication** – Secure login system for authorized access.

- **Contact Management** – Register, update, and delete customer contacts.

- **Personalized Bulk Emails** – Send emails to multiple contacts at once, with each message personalized using the contact’s first name for a personal touch.

##  Stack

**Frontend:**

* [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)

**Backend:**

* [Node.js](https://nodejs.org/)
* [Express.js](https://expressjs.com/)
* [TypeScript](https://www.typescriptlang.org/)

**Database:**
* [PostgreSQL](https://www.postgresql.org/)

**Email Service:**

* [Nodemailer](https://nodemailer.com/) (Gmail SMTP/OAuth2)


## Setup
### Clone the Repository
```
  git clone https://github.com/leoandretta/crm-mail-dispatcher.git crm-mail-dispatcher
  cd crm-mail-dispatcher
```
### API Setup
```
  cd api
  yarn install
  copy .env.example .env.<environment>
```
- Update the .env.\<environment> file with your environment-specific variables.
### Web Setup
```
  cd web
  yarn install
  copy .env.example .env.<environment>
```
- Update the .env.\<environment> file with your environment-specific variables.


## Running Containers

####  API
1. Open the api directory
```
  cd api/
```
2. Copy the example environment file
```
  copy .env.example .env.production
```
3. Setup the environment variables following the example file
4. Build the docker images
```
  docker build . -t crm-api:latest
```
5. Run the docker container
```
  docker run --name crm-api -p 4000:4000 -d crm-api:latest
```
####  WEB
1. Open the web directory
```
  cd web/
```
2. Copy the example environment file
```
  copy .env.example .env.production
```
3. Setup the environment variables following the example file
4. Build the docker images
```
  docker build . -t crm-web:latest
```
5. Run the docker container
```
  docker run --name crm-web -p 3000:80 -d crm-web:latest
```
---
### Running docker-compose
1. Open the root directory
2. Run the following command
```
  docker-compose up -d
```

## License
>You can check out the full license [here](https://github.com/leoandretta/crm-mail-dispatcher/blob/master/LICENSE)

This project is licensed under the terms of the **MIT** license.
