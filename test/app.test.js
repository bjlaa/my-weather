const expect = require('chai').expect
const getPlatformRequestBuilder = require('jovo-framework').util.getPlatformRequestBuilder
const { send } = require('jovo-framework').TestSuite
const fetch = require('node-fetch')


const { text } = require('../app/app.js');

for (let rb of getPlatformRequestBuilder('AlexaSkill', 'GoogleActionDialogFlowV2')) {
  
  describe('Weather on ' + rb.type(), () => {
    
    it('should greet the user and ask which city he/she wants the weather for', (done) => {
      send(rb.launch())
      .then((res) => {
        expect(res.isAsk(text.launchS, text.pickCityR)).to.equal(true)
        done()
      })
    })

    it('should ask again to pick a city', (done) => {
      send(rb.launch())
      .then(() => {
        return send(rb.intent('Unhandled'))
      })
      .then((res) => {
        expect(res.isAsk(text.unhandledS, text.unhandledR)).to.equal(true)
        done()
      })
    })

    it('should tell the weather of the selected city', (done) => {
      const cityName = 'Paris'
      send(rb.intent('GetWeatherIntent', { city: cityName }).setSessionNew(true))
      .then((res) => {
        fetch(`http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=02a0900e6eb6a56f45d7f3e7c5019257&units=metric`)
        .then(response => response.json())
        .then((responseParsed) => {
          const weatherText = `${text.getWeatherTPart1} ${cityName} ${text.getWeatherTPart2} ${responseParsed.main.temp_max} ${text.getWeatherTPart3} ${responseParsed.main.temp_min} ${text.getWeatherTPart4} ${responseParsed.weather[0].description}.`

          expect(res.isTell(weatherText)).to.equal(true)
          done()
        })
      })
    })

    it('should route to unhandle if an error is found in GetWeatherIntent', (done) => {
      send(rb.intent('GetWeatherIntent', { city: 'xx00phQ' }).setSessionNew(true))
      .then((res) => {
        expect(res.isAsk(text.unhandledS, text.unhandledR)).to.equal(true)
        done()
      })
    })
  })
}
