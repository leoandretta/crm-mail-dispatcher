CRM Mail Dispatcher
============

This is a Customer Relationship Management (CRM) system to help you manage customer contacts efficiently.  It offers user authentication, contact management, and personalized bulk email sending, where each recipient is greeted by their first name to maintain professionalism while adding a personal touch.

<!-- ![Chat Preview](img) -->

## Features
- **User Authentication** – Secure login system for authorized access.

- **Contact Management** – Register, update, and delete customer contacts.

- **Personalized Bulk Emails** – Send emails to multiple contacts at once, with each message personalized using the contact’s first name for a personal touch.

## Installation
#### Clone this repository
```
  git clone https://github.com/leoandretta/crm-mail-dispatcher.git crm-mail-dispatcher
```
#### Open the project directory
```
  cd crm-mail-dispatcher
```
#### Install Dependencies
```
  yarn install
```

## Development

####  WEB
1. Open the web workspace directory
```
  cd packages/web
```
2. Copy the example environment file
```
  copy .env.example .env.development
```
3. Setup the environment variables following the example file
---
####  API
1. Open the api workspace directory
```
  cd packages/web
```
2. Copy the example environment file
```
  copy .env.example .env.development
```
3. Setup the environment variables following the example file
---

Once the environments are setup and the dependencies installed, you can run  `yarn dev` to start the application on development.

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


## License
>You can check out the full license [here](https://github.com/leoandretta/crm-mail-dispatcher/blob/master/LICENSE)

This project is licensed under the terms of the **MIT** license.
