$(document).ready(function (){
    //Check to see if config.json file exists
    //If not create file and load setup

    //If so continue
        refreshPage();

        var refreshInterval = setInterval(refreshPage, 100000)
});

function refreshPage(){
    //Clear data before updating
    $(".clearable").remove();

    //Get data for all modules
    timeUpdater();
    weatherUpdater();
    stocksUpdater();
    coinUpdater();
    getHUEIP();

    //Once all data is loaded fade in all divs
    $(".mainDiv").fadeIn("slow");
}

function timeUpdater(){
        //Variables used for date and time calculation
        var d = new Date();
        var hours = d.getHours();
        var minutes = d.getMinutes();
        // var seconds = d.getSeconds();
        var AMPM = (hours > 12) ? "PM" : "AM";

        //Make formatting adjustments to minutes and hours if necessary
        hours = (hours > 12) ? (hours-= 12) : hours;
        minutes = (minutes < 10) ? ('0' + minutes) : minutes;
        // seconds = (seconds < 10) ? ('0' + seconds) : seconds;

        //Build date and time strings for output
        var dateString = d.toDateString();
        var timeString = hours + ":" + minutes + " " + AMPM;
        
        //Clear date and time before updating
        $("#date").empty();
        $("#time").empty();

        //Assign formatted string to Date and Time
        $("#date").append(dateString);
        $("#time").append(timeString);
}       

function weatherUpdater(){
    //Build an API URL
    var URLbase = 'http://api.openweathermap.org/data/2.5/weather?zip=';
    var zipCode = config.ZIP_CODE;
    var apiKey = config.WEATHER_KEY;
    var units = 'imperial';

    //Check if values are missing from config.js file
    if(zipCode == null || apiKey == null)
        alert("Missing values from config.js... unable to load weather module");
    else{
        var requestURL = URLbase + zipCode + ',us&units=' + units + '&appid=' + apiKey; 

        //Send ajax request
        $.ajax({
            type: 'GET',
            url: requestURL,
            success: function(data) {
                console.log(data);
                //Gather data icon identifier then lookup and retrieve proper icon
                var iconCode = data.weather[0].icon;
                var iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";  

                //Clear all weather fields before updating
                $("#location").empty();
                $("#tempHigh").empty();
                $("#tempLow").empty();
                $("#tempNow").empty();

                //Update html with JSON data
                $("#location").append(data.name);
                $("#weatherIcon").attr('src', iconURL);
                $("#tempHigh").append(data.main.temp_max.toFixed() + '\xB0');
                $("#tempLow").append(data.main.temp_min.toFixed() + '\xB0');
                $("#tempNow").append(data.main.temp.toFixed() + '\xB0');
            },
            error: function() {
                console.log("Error connecting to OpenWeatherMap API: " + apiKey);
            }
        });
    }
}

function stocksUpdater(){
    //Get stock symbols from config.json
    //
    //

    //Create array of stocks that user is interested in. 
    var stocks = ['AAPL', 'NFLX', 'TTWO'];

    //Clear Stock data before updating
    $("#stockSymbol").empty();
    $("#stockPrice").empty();

    //Iterate through each stock in array finding JSON then parsing data
    $.each(stocks, function (index, value){
        var baseURL = 'https://api.iextrading.com/1.0/stock/';
        var endURL = '/quote'        
        var requestURL = baseURL + value + endURL;

        //Send ajax request
        $.ajax({
            url: requestURL,
            success: function(data) {
                //Add new list items in respective <ul> elements
                $("#stockSymbol").append('<li>'+ data.symbol + ":" +'</li>');

                //Decide if stock is up or down
                var color;
                if (data.latestPrice > data.open)
                    color = 'green';
                else
                    color = 'red';

                $("#stockPrice").append('<li class = " ' + color + '">' + parseFloat(data.latestPrice).toFixed(2) + '</li>');
            }, 
            error: function() {
                console.log("Error connecting to iexTrading API");
            },
            type: 'GET'
        });
    });
}

function coinUpdater(){
    //Get coin symbols from config.json
    //
    //

    //Create array of coins that user is interested in. 
    var coins = ['bitcoin', 'ethereum', 'litecoin'];

    //Clear Coin data before updating
    $("#coinSymbol").empty();
    $("#coinPrice").empty();

    $.each(coins, function (index, value){
        var baseURL = 'https://api.coinmarketcap.com/v1/ticker/'
        var requestURL = baseURL + value + '/';

        //Send ajax request
        $.ajax({
            url: requestURL,
            success: function(data) {
                //Add new list items in respective <ul> elements
                $("#coinSymbol").append('<li>'+ data[0].symbol + ":" +'</li>');
                console.log(data[0]);
                //Decide if coin is up or down in the past 24 hours
                var color;
                if (data[0].percent_change_24h > 0)
                    color = 'green';
                else
                    color = 'red';

                $("#coinPrice").append('<li class = " ' + color + '">' + parseFloat(data[0].price_usd).toFixed(2) + '</li>');
            },
            error: function(data) {
                console.log("Error connecting to coinmarketcap API");
            },
            type: 'GET'
        });
    });
}


function getHUEIP(){
    //Get Hue Bridge IP Address
    $.ajax({
        type: 'GET',
        url: "https://www.meethue.com/api/nupnp",
        success: connectToBridge,
        error: function(data) {
            var hueIPAddress = null;
            console.log("Error connecting to Hue API");
        }
    });
}
    


function connectToBridge(data){
        console.log("connectToBridge");
        //Get user ID from config file
        var hueUserName = config.HUE_USER_ID;

        if (hueUserName == null)
            alert("Missing values from config.js... unable to load HUE module");
        else{

            var bridgeIP = data[0].internalipaddress;

            //url for hue bridge api
            var lightUrl = 'http://' + bridgeIP + '/api/' + hueUserName + '/lights';

            //Send ajax request
            $.ajax({
                type: 'GET',
                url: lightUrl,
                success: function(data) {
                    $.each(data, function(index, value){
                        var brightness = (value.state.bri / 254);
                        var bulb = '<td class="clearable"><img style = "opacity:'+ brightness + 
                                    '" src = "Images/bulb.png"></img></td>';

                        switch(value.name.charAt(0)){
                            case 'B':
                                $("#bedroom").append(bulb);
                                break;
                            case 'D':
                                $("#dining").append(bulb);
                                break;
                            case 'L':
                                $("#living").append(bulb);
                                break;
                            case 'O':
                                $("#office").append(bulb);
                                break;
                            default:
                                console.log("Unexpected bulb name: " + value.name);
                        }
                    });
                    
                },
                error: function(data) {
                    console.log("Error connecting to Hue API");
                }
            });
        }
    }



