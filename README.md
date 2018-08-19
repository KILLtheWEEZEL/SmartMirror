SmartMirror

  This project is my attempt at a smart mirror for personal use. 
  Project will consist of multiple modules with newer modules coming in a future update

Current Modules:
  Weather
  Home
  Money
  Date


  Weather
    Connects to openweather API to collect weather data for Pittsburgh.
  
  Home
    Connects to Hue Bridge in home network. 
    Displays light data by room and bulb.
    Bulb icon opacity is correlated to brightness of bulb.

  Money
    Connect to iextrading API for stock data
    Connect to coinmarketcap for coin data
    Modify Array values to match stock symbols and coins you wish to display
    Stock prices will show green if the current price is higher than the open price, else they will show red
    Coin prices will show green if they are trending upwards in the past 24 hours, else they will show red
    
  Date
    Date collected using built in date function

Intended Updates:

  1) Setup/Configuration menu
    Save configuration data as a .json or .txt
    Allow user to toggle on/off modules
    Allow user to relocate modules
    Allow user to resize modules
      4 sizes planned taking up equal width but variable hight (S: 25%, M: 50%, L: 75%, XL: 100%)
      Smaller modules will show just the essentials while a larger modules will show an expanded view

  2) More Modules:
    Word of the Day
    Twitter
    News
    RSS Feeds
    Transit
    Email 
    Home(Update)

  