SmartMirror
  This project is my attempt at a smart mirror for personal use. 
  Project will consist of multiple modules with newer modules coming in a future update

Current Modules-------------------------------------------------------------------------------------
  Weather:
    Requires configuration using config.js file
    Connects to openweather API to collect weather data for configured zipcode.
  
  Home:
    Find IP address of bridge using Hue web utility 
    Connects to Hue Bridge in home network. 
    Displays light data by room and bulb.
    Bulb icon opacity is correlated to brightness of bulb.

  Money:
    Connect to iextrading API for stock data
    Connect to coinmarketcap for coin data
    Modify Array values to match stock symbols and coins you wish to display
    Stock prices will show green if the current price is higher than the open price, else they will show red
    Coin prices will show green if they are trending upwards in the past 24 hours, else they will show red
    
  Date:
    Date collected using built in date function

Configuration---------------------------------------------------------------------------------------
  Weather:
    Sign up for a free personal use API key at https://home.openweathermap.org/users/sign_up
    
    In the config.js replace the value of WEATHER_KEY from null to your api Key sourounded by ""
    ex. WEATHER_KEY : "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q"

    In the config.js replace the value of ZIP_CODE from null to your zip code sourounded by ""
    ex. ZIP_CODE : "15206"

  Home:
    Your HUE bridge IP address can be found at https://www.meethue.com/api/nupnp
    Your HUE username is created by following Step 3 at https://www.developers.meethue.com/documentation/getting-started

    In the config.js replace the value of HUE_USER_ID from null to your username surrounded by ""
    ex. HUE_USER_ID : "zDIuz0F8sL9iRTLRukWid7Cr8xdzFLtCDYRd5ob4"


Intended Updates------------------------------------------------------------------------------------
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

  