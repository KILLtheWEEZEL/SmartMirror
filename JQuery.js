$(document).ready(function (){
    //Check to see if config.json file exists
    //If not create file and load setup

    //If so continue
        //Get data for all modules
        timeUpdater();
        weatherUpdater();
        stocksUpdater();
        coinUpdater();
        homeUpdater();
    //Once all data is loaded fade in all divs
    $(".mainDiv").fadeIn("slow");
});

function timeUpdater(){
        //Variables used for date and time calculation
        var d = new Date();
        var hours = d.getHours();
        var minutes = d.getMinutes();
        var seconds = d.getSeconds();
        var AMPM = (hours > 12) ? "PM" : "AM";

        //Make formatting adjustments to minutes and hours if necessary
        hours = (hours > 12) ? (hours-= 12) : hours;
        minutes = (minutes < 10) ? ('0' + minutes) : minutes;

        //Build date and time strings for output
        var dateString = d.toDateString();
        var timeString = hours + ":" + minutes + ":" + seconds + " " + AMPM;
        
        
        //Assign formatted string to Date and Time
        $("#date").append(dateString);
        $("#time").append(timeString);
}       

function weatherUpdater(){
    //Get zipcode, apikey, and units from config.json
    //
    //

    //Build an API URL
    var URLbase = 'http://api.openweathermap.org/data/2.5/weather?zip=';
    var zipCode = 15206;
    var apiKey = 'c6b836d38005e54e469d7e3046573bc1';
    var units = 'imperial';
    var requestURL = URLbase + zipCode + ',us&units=' + units + '&appid=' + apiKey; 

    //Send ajax request
    $.ajax({
        url: requestURL,
        success: function(data) {
            console.log(data);
            //Gather data icon identifier then lookup and retrieve proper icon
            var iconCode = data.weather[0].icon;
            var iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";  

            //Update html with JSON data
            $("#location").append(data.name);
            $("#weatherIcon").attr('src', iconURL);
            $("#tempHigh").append(data.main.temp_max.toFixed() + '\xB0');
            $("#tempLow").append(data.main.temp_min.toFixed() + '\xB0');
            $("#tempNow").append(data.main.temp.toFixed() + '\xB0');
        },
        error: function() {
            console.log("Error connecting to OpenWeatherMap API");
        },
        type: 'GET'
    });
}

function stocksUpdater(){
    //Get stock symbols from config.json
    //
    //

    //Create array of stocks that user is interested in. 
    var stocks = ['AAPL', 'NFLX', 'TTWO'];

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

function homeUpdater(){
    //Get hue api from config.json
    //
    //

    //local url for hue bridge
    var lightUrl = 'http://192.168.0.18/api/zDIuz0F8sL9iRTLRukWid7Cr8xdzFLtCDYRd5ob4/lights'

    //Send ajax request
    $.ajax({
        url: lightUrl,
        success: function(data) {
            $.each(data, function(index, value){
                var brightness = (value.state.bri / 254);
                var bulb = '<td><img style = "opacity:'+ brightness + '" src = "Images/bulb.png"></img></td>';

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
                        console.log("Unexpected bulb name: " + valu.name);
                }
            });
            
        },
        error: function(data) {
            console.log("Error connecting to Hue API");
        },
        type: 'GET'
    });
}



