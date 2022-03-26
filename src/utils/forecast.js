const request = require('request');

const forecast = (latitude, longitude, callback) => {
	const url = 'http://api.weatherstack.com/current?access_key=01ef3c36ac7ba4492d037e6b61a4d77d&query=' + latitude + ',' + longitude + '&units=f';

	request({ url, json: true }, (error, { body }) => {
		if (error) {
			callback('Unable to connect to weather service!', undefined);
		} else if (body.error) {
			callback('Unable to find location! Try another search!', undefined);
		} else {
			callback(undefined, `The weather is ${body.current.weather_descriptions[0]}. The humidity is ${body.current.humidity}%.`);
		}
	});
}

module.exports = forecast;
