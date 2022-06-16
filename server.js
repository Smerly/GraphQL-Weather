// Imports

const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
require('dotenv').config();
const fetch = require('node-fetch');

// Vars

const app = express();
const port = 5000;

// Helper functions

function ifExists(item, tester) {
	if (tester) {
		console.log(tester);
		return null;
	} else {
		return null;
	}
}

// Schema

const schema = buildSchema(`

enum Units {
    standard
    metric
    imperial
  }

type Weather {
    temperature: Float
    description: String
    feelsLike: String
    tempMin: Int
    tempMax: Int
    pressure: Int
    humidity: Int
}

type Query {
    getWeather(zip: Int!, unit: Units): Weather!
}

`);

// Resolver

const root = {
	getWeather: async ({ zip, unit }) => {
		const apiKey = process.env.API_KEY;
		const url = `https://api.openweathermap.org/data/2.5/weather?zip=${zip}&appid=${apiKey}&units=${unit}`;
		const res = await fetch(url);
		const json = await res.json();
		console.log(json);
		const temperature = json.cod != 200 ? json.main.temp : null;
		const description = json.cod != 200 ? json.weather[0].description : null;
		const feelsLike = json.cod != 200 ? json.main.feels_like : null;
		const tempMin = json.cod != 200 ? json.main.temp_min : null;
		const tempMax = json.cod != 200 ? json.main.tempMax : null;
		const pressure = json.cod != 200 ? json.main.pressure : null;
		const humidity = json.cod != 200 ? json.main.humidity : null;

		return {
			temperature,
			description,
			feelsLike,
			tempMin,
			tempMax,
			pressure,
			humidity,
		};
	},
};

// Route

app.use(
	'/graphql',
	graphqlHTTP({
		schema,
		rootValue: root,
		graphiql: true,
	})
);

// Start app

app.listen(port, () => {
	console.log(`Running on port ${port}`);
});
