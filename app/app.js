'use strict';

// =================================================================================
// App Configuration
// =================================================================================
const fetch = require('node-fetch');
const { App } = require('jovo-framework');

const config = {
  logging: true,
};

const text = {
  launchS: 'Welcome to my weather! What\'s the city you\'d like to get the weather forecast for?',
  pickCityS: 'What\'s the city you\'d like to get the weather forecast for?',
  pickCityR: 'To get the weather forecast, say the name of your city.',
  getWeatherTPart1: "Today in",
  getWeatherTPart2: "the maximum temperature will be of",
  getWeatherTPart3: "degrees and the minimum will be of",
  getWeatherTPart4: "degrees. There will be",
  unhandledS: "Sorry, I didn't get that. Say the name of your city.",
  unhandledR: "What's the name of your city?"
};

const app = new App(config);


// =================================================================================
// App Logic
// =================================================================================

app.setHandler({
  'LAUNCH': function() {
    this.ask(text.launchS, text.pickCityR)
  },

  'GetWeatherIntent': function(city) {
    const cityName = city.value;
    const self = this;

    fetch(`http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=02a0900e6eb6a56f45d7f3e7c5019257&units=metric`)
    .then(response => response.json())
    .then((responseParsed) => {
      console.log('Response parsed', responseParsed)
      const weatherText = `${text.getWeatherTPart1} ${cityName} ${text.getWeatherTPart2} ${responseParsed.main.temp_max} ${text.getWeatherTPart3} ${responseParsed.main.temp_min} ${text.getWeatherTPart4} ${responseParsed.weather[0].description}.`

      self.tell(weatherText)
    })
    .catch((error) => {
      console.log('error in GetWeatherIntent: ', error)
      this.toIntent('Unhandled')
    })
  },

  'Unhandled': function() {
    this.ask(text.unhandledS, text.unhandledR)
  },
});

module.exports = {
  app,
  text
}

