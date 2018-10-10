require('dotenv').config();

var inquirer = require("inquirer");

var fs = require("fs");

var moment = require("moment");

var request = require("request");

var keys = require("./keys.js");

var Spotify = require("node-spotify-api");

var spotify = new spotify(keys.spotify);

var username;

var action;

var item;

inquirer
    .prompt({
        type: "input",
        message: "What is your name?",
        name: "username"
    })
    .then(function (response) {
        actionPrompt();
    })

function actionPrompt() {
    inquirer
        .prompt([
            {
                message: "What would you like to do?",
                type: "list",
                choice: ["Search for a Concert", "Search for a Song", "Search for a movie", "Search for something", "Nothing"],
                name: "action"
            },
        ])
        .then(function (inquirerResponse) {
            action = inquirerResponse.action;

            switch (action) {
                case "Search for a Concert":
                    promptForQuery("concert");
                    break;
                case "Search for a Song":
                    promptForQuery("song");
                    break;
                case "Search for a movie":
                    promptForQuery("movie");
                    break;
                case "Search for something":
                    heyLiri("do-what-it-says");
                    break;
                case "Nothing":
                    console.log("Thank You for using LIRI! " + username);
                    break;
            }
        });
    function concert() {
        var artist = item;
        request("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp", function (error, response, body) {

            //console.log(JSON.parse(body, null, 2));
            if (!error && response.statusCode === 200) {

                JSON.parse(body).forEach(function (event) {
                    console.log("*********************");
                    console.log("Venue: " + event.venue.name);
                    console.log("City: " + event.venue.city);

                    //using moment to format date
                    var date = moment(event.datetime);
                    console.log("When: " + date.format("MM/DD/YYYY"));
                });
                actionPrompt();
            };
        });

    };
    function spotifySong(item) {
        var song = item;

        spotify.search({ type: 'track', query: song }, function (err, data) {
            if (err) {
                return console.log("Error occurred: " + err);
            }

            //console.log(data);
            var playList = data.tracks.items;

            playList.forEach(function (elements) {
                console.log("*********************");
                console.log(elements.artist[0].name)
                console.log(elements.name)
                console.log(elements.href)
                console.log(elements.album.name)
            })
            console.log("*******************");
            console.log("I found " + playList.length + " songs.");
            actionPrompt();
        });
    };
    function movie(item) {
        var movie = item;
        request("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy", function (error, response, body) {

            //If request was successful
            if (!error && response.statusCode === 200) {

                //Then log the following from the site!
                console.log("****************************************")
                console.log("The Title: " + JSON.parse(body).Title);
                console.log("Year:" + JSON.parse(body).Year);
                console.log("imdb Rating: " + JSON.parse(body).imdbRating);
                console.log("Rotton Tomatos: " + JSON.parse(body).Ratings[1].Value);
                console.log("Produced in: " + JSON.parse(body).Country);
                console.log("Languages: " + JSON.parse(body).Language);
                console.log("Plot: " + JSON.parse(body).Plot);
                console.log("Actors: " + JSON.parse(body).Actors);
                console.log("***************************************")
            }

            actionPrompt();
        });
    };
    function doWhat() {
        fs.readFile("random.txt", "UTF8", function (error, data) {
            if (error) {
                return console.log(error);
            }
            var data = data.split(",");
            item = data[1];
            heyLiri(data[0]);
        })
    };
    function heyLiri(action) {
        switch (action) {
            case "concert":
                concert(item);
                break;
            case "song":
                spotifySong(item);
                break;
            case "movie":
                if (!item) {
                    console.log("*******You did not pick a movie.********")
                    item = "Mr. Nobody"
                }
                movie(item);
                break;
            case "do-what-it-says":
                doWhat(item);
                break;
            default:
                console.log("I Don't Get It.")
        };

    }
    function logIt() {
        fs.appendFile("log.txt", action + ", " + item + ", ", function (error) {
            if (error) {
                console.log("It could not be log becaue " + error)
            }
        })
    }
    function promptForQuery(query) {
        inquirer
            .prompt(
                {
                    type: "input",
                    message: "What " + query + " should I look?",
                    name: "item"
                }
            )
            .then((response) => {
                item = response.item;
                logIt();
                heyLiri(query)
            })
    }
}