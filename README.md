liri-node-app
Requirements

Make a Node.js app that depends on user input from the command line
Integrate Spotify, and OMDb APIs via the appropriate NPM modules
Use API calls and parse through returned JSON objects, outputting them in a specified format
Read commands and queries from file

Technologies Used

Node.js
JavaScript
Spotify API (via spotify npm module)
OMDb API (via request npm module)
Bands In Town API (via request npm module)

Code Explanation

These app does the following functions after inputing your name:
1. Concert search.
2. Song search.
3. Movie search
4. Selecting "Search for something" returns a response of "i dont get it."
5. Selecting "Nothing" returns a reponse of "Thank you for using Liri! Michael"

The program also makes a request to the Spotify API, and we get back a JSON object that includes everything we need (artist(s), song, preview link, and album)
The program also makes a HTTP request to the OMDb API using the request NPM module, and we get back a JSON object that includes everything we need (title, year, IMDb rating, language, etc.)

https://youtu.be/fL8bO6jBrHo