const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();
const port = process.env.PORT || 3000;

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partials = path.join(__dirname, '../templates/partials');

// Setup Handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partials);

// Setup static directory to server
app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
	res.render('index', {
		'title': 'Weather App',
		'name': 'Jason'
	});
});

app.get('/about', (req, res) => {
	res.render('about', {
		'title': 'About Me',
		'name': 'Jason'
	});
});

app.get('/help', (req, res) => {
	res.render('help', {
		'helpText': 'This is a help page',
		'title': 'Help',
		'name': 'Jason'
	});
});

app.get('/weather', (req, res) => {
	if (!req.query.address) {
		return res.send({
			'error': 'You must provide an address'
		});
	}

	geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
		if (error) {
			return res.send({ error });
		}

		forecast(latitude, longitude, (error, forecastData) => {
			if (error) {
				return res.send({ error });
			}

			res.send({
				'forecast': forecastData,
				location,
				'address': req.query.address
			});
		});
	})
});

app.get('/products', (req, res) => {
	console.log(req.query);
	if (!req.query.search) {
		return res.send({
			'error': 'You must provide a search term'
		});
	}

	res.send({
		'products': []
	});
});

app.get('/help/*', (req, res) => {
	res.render('404', {
		'errorMessage': 'Help article not found',
		'title': '404',
		'name': 'Jason'
	});
});

app.get('*', (req, res) => {
	res.render('404', {
		'errorMessage': 'Page not found',
		'title': '404',
		'name': 'Jason'
	});
});

// app.com
// app/com/help
// app.com/about

app.listen(port, () => {
	console.log('Server is up on port ' + port);
});