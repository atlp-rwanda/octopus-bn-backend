Barefoot Nomad - Making company travel and accomodation easy and convinient.
=======
[![](https://img.shields.io/badge/Reviewed_by-Hound-a873d1.svg)](https://houndci.com)
[![Coverage Status](https://coveralls.io/repos/github/andela/octopus-bn-backend/badge.svg?branch=ch-configure-coveralls-170947427)](https://coveralls.io/github/andela/octopus-bn-backend?branch=ch-configure-coveralls-170947427)
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
  
