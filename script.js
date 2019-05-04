$(document).ready(function (){
    //TODO: Check to see if config.json file exists
    
        //TODO: Loop through all modules; Assign individual refreshInteverals to map
        let refreshInterval = setInterval(refreshPage, 100000)

        //TODO: Receive map of refreshIntervals and pass to modules
        refreshPage();

    //TODO: If not found
});

function refreshPage(){
    //Clear data before updating
    $(".mainDiv").empty();

    //Update data for all modules
    timeUpdater();
    weatherUpdater();
    stocksUpdater();
    coinUpdater();
    getHUEIP();

    //Once all data is loaded fade in all divs
    $(".mainDiv").fadeIn("slow");
}

function timeUpdater(){
    try{
        //Get time variables
        let d = new Date();
        let hours = d.getHours();
        let minutes = d.getMinutes();
        // let seconds = d.getSeconds();
        

        //Format time variables
        let AMPM = (hours > 12) ? "PM" : "AM";
        hours = (hours > 12) ? (hours -= 12) : hours;
        minutes = (minutes < 10) ? ('0' + minutes) : minutes;
        // seconds = (seconds < 10) ? ('0' + seconds) : seconds;

        //Build date and time strings for output
        let dateString = d.toDateString();
        let timeString = hours + ":" + minutes + " " + AMPM;

        //Assign formatted string to Date and Time
        $("#events").append('<p id= "time">' + timeString + '</p>');
        $("#events").append('<p id= "date">' + dateString + '</p>');
    }
    catch(err){
        //Set border color if error
        $("#events").append('<img src = "Images/error64.png" style="display:block; margin-left: auto; margin-right: auto;"></img>');
    }
}       

function weatherUpdater(){
    try{
        //Build URL for weater API
        let URLbase = 'http://api.openweathermap.org/data/2.5/weather?zip=';
        let zipCode = config.WEATHER.ZIP_CODE;
        let apiKey = config.WEATHER.WEATHER_KEY;
        let units = 'imperial';
        let requestURL = URLbase + zipCode + ',us&units=' + units + '&appid=' + apiKey; 

        //Empty weather div before updating
        $("#weather").empty();

        $.ajax({
            type: 'GET',
            url: requestURL,
            success: function(data) {
                console.log(data);
                //Gather data icon identifier then lookup and retrieve proper icon
                let iconCode = data.weather[0].icon;
                let iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";  

                //Update html with JSON data
                $("#weather").append('<h3 id = "location"></h3>');
                $("#location").append(data.name);

                $("#weather").append('<span><img id="weatherIcon" src="'+ iconURL +'"></span>')
                $("#weather").append('<table id = "weatherTable" style="width:100%"></table>');
                
                $("#weatherTable").append('<th id = "tempLow" class = "blue"></th>');
                $("#tempLow").append(data.main.temp_min.toFixed() + '\xB0');

                $("#weatherTable").append('<th id = "tempNow" class = ""></th>');
                $("#tempNow").append(data.main.temp.toFixed() + '\xB0');

                $("#weatherTable").append('<th id = "tempHigh" class = "red "></th>');
                $("#tempHigh").append(data.main.temp_max.toFixed() + '\xB0');
            },
            error: function() {
                console.log("Error connecting to OpenWeatherMap API: " + apiKey);
            }
        });
    }
    catch(err){
        console.log("Weather Error - Setting Caution");
        $("#weather").append('<h3>Weather</h3>');
        $("#weather").append('<img src = "Images/error64.png" style="display:block; margin-left: auto; margin-right: auto;"></img>');
    }
}

function stocksUpdater(){
    try{
        //Add container div and header
        $("#money").append('<div id = "stockTable" class = "table"></div>');
        $("#stockTable").append('<h3>Stocks</h3>');

        //Get stock symbols from config.json
        let stocks = config.MONEY.STOCKS;
        let success = false;

        //Iterate through each stock in array finding JSON then parsing data
        $.each(stocks, function (index, value){
            //Build URL for stock API
            let baseURL = 'https://api.iextrading.com/1.0/stock/';
            let endURL = '/quote'        
            let requestURL = baseURL + value + endURL;

            $.ajax({
                type: 'GET',
                url: requestURL,
                success: function(data) {
                    //if this is the first success create <ul> elements
                    if(!success){
                        success = true;
                        $("#stockTable").append('<ul id = "stockSymbol" class = "symbol"></ul>');
                        $("#stockTable").append('<ul id = "stockPrice" class = "price"></ul>');
                    }
                    
                    //Decide if stock is up or down since opening
                    let color = (data.latestPrice > data.open) ? 'green' : 'red';

                    //Add new list items in respective <ul> elements
                    $("#stockSymbol").append('<li>' + data.symbol + ":" + '</li>');
                    $("#stockPrice").append('<li class = " ' + color + '">$' + 
                        parseFloat(data.latestPrice).toFixed(2) + '</li>');
                }, 
                error: function() {
                    throw "Error connecting to iexTrading API";
                }
            });
        });
        //Set border color if successful
        // $("#stockTable").addClass('whiteBorder').removeClass('yellowBorder');
    }
    catch(err){
        //Set border color if error
        console.log("Stock Error - Setting Caution");
        $("#stockTable").append('<img src = "Images/error64.png" style="display:block; margin-left: auto; margin-right: auto;"></img>');
        // $("#stockTable").addClass('yellowBorder').removeClass('whiteBorder');
    }
}

function coinUpdater(){
    try{
        //Add container div and header
        $("#money").append('<div id = "coinTable" class = "table"></div>');
        $("#coinTable").append('<h3>Coins</h3>');
        
        //Get coin symbols from config.json
        let coins = config.MONEY.COINS;
        let success = false;

        $.each(coins, function (index, value){
            //Build URL for coin API
            let baseURL = 'https://api.coinmarketcap.com/v1/ticker/'
            let requestURL = baseURL + value + '/';

            $.ajax({
                type: 'GET',
                url: requestURL,
                success: function(data) {
                    //if this is the first success create <ul> elements
                    if(!success){
                        success = true;
                        $("#coinTable").append('<ul id = "coinSymbol" class = "symbol"></ul>');
                        $("#coinTable").append('<ul id = "coinPrice" class = "price"></ul>');
                    }

                    //Decide if coin is up or down in the past 24 hours
                    let color = (data[0].percent_change_24h > 0) ? 'green' : 'red';

                    //Add new list items in respective <ul> elements
                    $("#coinSymbol").append('<li>'+ data[0].symbol + ":" + '</li>');
                    $("#coinPrice").append('<li class = " ' + color + '">$' + parseFloat(data[0].price_usd).toFixed(2) + '</li>');
                },
                error: function(data) {
                    throw "Error connecting to Coin API";
                }
            });
        });
        //Set border color if successful
        // $("#coinTable").addClass('whiteBorder').removeClass('yellowBorder');
    }
    catch(err){
        //Set border color if error
        console.log("Coin Error - Setting Caution");
        $("#coinTable").append('<img src = "Images/error64.png" style="display:block; margin-left: auto; margin-right: auto;"></img>');
        // $("#coinTable").addClass('yellowBorder').removeClass('whiteBorder');
    }
}

function getHUEIP(){
    //Get Hue Bridge IP Address
    $.ajax({
        type: 'GET',
        url: "https://www.meethue.com/api/nupnp",
        success: connectToHueBridge,
        error: function(data) {
            let hueIPAddress = null;
            console.log("Error connecting to Hue API");
        }
    });
}
    
function connectToHueBridge(data){
    try{
        //Add header
        $("#home").append('<h3>Home</h3>');

        //Build url for hue bridge api
        let hueAPIKey = config.HOME.HUE_API_KEY;
        let bridgeIP = data[0].internalipaddress;
        let lightUrl = 'http://' + bridgeIP + '/api/' + hueAPIKey + '/lights';

        //Send ajax request
        $.ajax({
            type: 'GET',
            url: lightUrl,
            success: function(data) {
                $.each(data, function(index, value){
                    let brightness = (value.state.bri / 254);
                    let src = "Images/bulb.png";
                    let bulb = '<td><img style = "opacity:' + brightness + 
                                '" src = "' + src +'"></img></td>';

                    //Create bulbtable if it does not already exist
                    if(!$("#bulbTable").length) { 
                        $("#home").append('<table id = "bulbTable" style = "width:100%">');}

                    //
                    //TODO: Use value.name to dynamically create rows and find icons
                    //

                    //Find rooms and populate rows adding icons before each row of bulbs
                    switch(value.name.charAt(0)){
                        case 'B':
                            if(!$("#bedroom").length) { 
                                $("#bulbTable").append('<tr id = "bedroom">' + 
                                    '<th><img src = "Images/bed.png"></img></th></tr>');}
                            $("#bedroom").append(bulb);
                            break;
                        case 'D':
                            if(!$("#dining").length) { 
                                $("#bulbTable").append('<tr id = "dining">' + 
                                    '<th><img src = "Images/wine.png"></img></th></tr>');}
                            $("#dining").append(bulb);
                            break;
                        case 'L':
                            if(!$("#living").length) { 
                                $("#bulbTable").append('<tr id = "living">' + 
                                    '<th><img src = "Images/chair.png"></img></th></tr>');}
                            $("#living").append(bulb);
                            break;
                        case 'O':
                            if(!$("#office").length) { 
                                $("#bulbTable").append('<tr id = "office">' + 
                                    '<th><img src = "Images/laptop.png"></img></th></tr>');}
                            $("#office").append(bulb);
                            break;
                        default:
                            console.log("Unexpected bulb name: " + value.name);
                    }
                });
            },
            error: function(data) {
                throw "Error connecting to Hue API";
            }
        });

        //Set border color if successful
        // $("#home").addClass('whiteBorder').removeClass('yellowBorder');
    }
    catch(err){
        //Set border color if error
        console.log("Home Error - Setting Caution");
        $("#home").append('<img src = "Images/error64.png" style="display:block; margin-left: auto; margin-right: auto;"></img>');
        // $("#home").addClass('yellowBorder').removeClass('whiteBorder');
    } 
}