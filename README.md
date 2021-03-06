Barefoot Nomad - Making company travel and accomodation easy and convinient.
=======
[![](https://img.shields.io/badge/Reviewed_by-Hound-a873d1.svg)](https://houndci.com)
[![Coverage Status](https://coveralls.io/repos/github/andela/octopus-bn-backend/badge.svg?branch=develop)](https://coveralls.io/github/andela/octopus-bn-backend?branch=develop)
[![Build Status](https://travis-ci.org/andela/octopus-bn-backend.svg?branch=develop)](https://travis-ci.org/andela/octopus-bn-backend)
[![Maintainability](https://api.codeclimate.com/v1/badges/a357c08fe45d5c492939/maintainability)](https://codeclimate.com/github/andela/octopus-bn-backend/maintainability)
## Vision
Make company global travel and accommodation easy and convenient for the strong workforce of savvy members of staff, by leveraging the modern web.

---
## Project setup
---
### Dotenv setup
 1. ***Get some stuffs on table***
  * Run ``` npm install ```
  * Create ``` .env ``` in project root directory
  * Take a look at the ``` .env.example ```  file which is in the project root directory to have a clue on environment variables that are being used in this project
  * Copy all keys from the ``` .env.example ```  file to ``` .env ``` file and add values to corresponding keys. These can be obtained from the project administrator
  * Feel free to add other keys and values according to your feature requirements
  ***Note***: Add keys in ``` .env.example ``` to ease next setup for other developers.

  2. ***Time to serve***
   * For you to use your new environment variable you have to import ``` dotenv ``` module in the file where you want to utilise your environment variables and configure it. like this: ```import dotenv from 'dotenv';
   dotenv.config();```

   * Then you'll be able to access your environment variables via ``` process.env.YOUR_KEY ```
   * That's it, you're good to go!, happy coding!
### Sequelize ORM setup
1. ***Configuring ```.env```***
   * Download and install [pgAdmin](https://www.postgresql.org/download/)
   * Create two databases, one for testing and another for development.
   * Copy ``` DATABASE_DEV_URL=postgres://your_db_user:your_password@127.0.0.1:5432/your_dev_db_name ``` 
          ``` DATABASE_TEST_URL=postgres://your_db_user:your_password@127.0.0.1:5432/your_test_db_name``` URLs
    from ```.env.example``` to ```.env```
   * Edit them with your real database user, password and database name.
2. ***Running Migrations***
   * Run ``` npm run migrateDb ``` in terminal to fire up migration
3. ***Undoing Migrations***
  * Run ``` npm run revertMigration ``` to undo all migrations
4. Running Seeds
 * Run ``` npm run seedDb ``` in terminal to run all seeds
5. Undoing Seeds
 * Run ``` npm run revertSeed ``` in termninal to undo all seeds data from the database

### Running server
   * Run `npm run dev` in terminal
### Running tests
   * Run `npm run test` in terminal

### Api Documentation
[Swagger Documentation](https://octopus-bn-backend-staging.herokuapp.com/api-docs)



