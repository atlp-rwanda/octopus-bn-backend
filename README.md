Barefoot Nomad - Making company travel and accomodation easy and convinient.
=======

## Vision
Make company global travel and accommodation easy and convenient for the strong workforce of savvy members of staff, by leveraging the modern web.

---
## Project setup
---
### Dotenv setup
 1. ***Get some stuffs on table***
  * Run ``` npm install ```
  * Create ``` .env ``` in project root directory
  * Take a look on ``` env.example.js ``` which is in project root directory to have a clue on environment variables that are already being used in project
  * Copy all keys from ``` .env.example.js ``` to ``` .env ``` and add values to corresponding keys
  * Feel free to add other keys and values according to your feature requirements
  ***Note***: Add keys in ``` .env.example.js ``` to ease next setup for other developers.

  2. ***Time to serve***
   * For you to use your new environment variable you have to import ``` dotenv ``` file anywhere you want to utulise your environment variables and configure it. like this: ``` import dotenv from 'dotenv';dotenv.config(); ```
   * Then you'll be able to access your environment variables via ``` process.env.YOUR_KEY ```
   * That's it, you're good to go!, happy coding!
  
