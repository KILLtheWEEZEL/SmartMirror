# SmartMirror

This project is my attempt at a smart mirror mostly for personal use. 

Project will consist of multiple modules
-Weather
-Home
-Money
-Date


-Weather
  Connects to openweather API to collect weather data for Pittsburgh.
  
-Home
  Connects to Hue Bridge in home network. 
  Displays light data by room and bulb.
  Bulb icon opacity is correlated to brightness of bulb.

-Money
  Connect to iextrading API for stock data
  Connect to coinmarketcap for coin data
  Modify Array values to match stock symbols and coins you wish to display
  Coin prices will show green if they are trending upwards in the past 24 hours, else they will show red
  Stock prices will show green if the current price is higher than the open price, else they will show red
  
-Date
  Date collected using built in date function
