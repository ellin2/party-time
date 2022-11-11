# It's party time!

##Who's bringing what?

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app)
and uses Firebase as the backend and database.
Material-UI is also used.

After cloning this project, in `/party-time/party-time`, run:
####`npm install` 
This should get you everything you need. \
If that doesn't work, try:
```
 npm i firebase bootstrap
 npm install @mui/material
 npm install @mui/x-data-grid
 npm install @mui/system
```
Then, run:
####`npm start`
A tab should open automatically in your browser. 
If not, go to http://localhost:3000. 

Do not run multiple instances on different ports.
##Background

I was inspired to make this given the Thanksgiving Potlucks coming up and the many festivities each 
year. Everyone knows that while bringing yourself is a great first step, costumes, drinks, food, and fun are greatly 
appreciated and not to be left out!

##Features
This app allows guests and hosts to RSVP, modify sign ups, and plan accordingly. 

How many desserts will there be? How many people should I prepare for? 
The interactive table allows users to sort and filter data to answer these questions, and more.

##Future Work
I figured I should share this app but still
have quite the laundry list of to-dos, tweaks, and nice-to-haves. 
Ping me if you're curious (or you'll just have to wait!)

####Top of Mind: 
- Architecture:
    - Modularize code by separating components into their own handlers and classes
    - Use CSS for reusable component styling
- UI: 
    - Create a more unified look & feel using custom CSS
    - Make the app more interactive (e.g. hover effects, dialogs)
    - And more responsive (component sizing based on input and viewport)
- Testing & Error Handling:
    - Create tests capturing expectations in different states (e.g. on open; when adding or editing an attendee)

