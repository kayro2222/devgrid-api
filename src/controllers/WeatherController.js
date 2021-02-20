const weatherApi = require('../services/weatherApi');
const client = require('../services/redis');

module.exports = {
	async index(request, response){
		try{
			const { max_number } = request.query;

			const weathers = await client.get("weathers").then((result) => {
				if(result){
					return JSON.parse(result);
				}

				return [];
			});

			if(max_number){
				const filteredWeathers = await weathers.filter((weather, key) => key < max_number);

				return response.json(filteredWeathers);
			}

			return response.json(weathers);
		}catch(error){
			return response.status(500).send({
				error: true,
				message: "Sorry. A system problem has ocurrred."
			})
		}
	},

	async getByCity(request, response) {
		try{
			const { city } = request.params;

			const weather = await weatherApi.get(`/weather?q=${city}`).then((response) => {
				return response.data;
			}).catch((error) => {
				if(error.response){
					return error.response.data;
				}
			});

			if(weather.message){
				return response.status(404).send({
					error: true,
					message: "Sorry. We couldn't find the specified city."
				});
			}

			const weathers =  await client.get("weathers").then((result) => {
				if(result){
					return JSON.parse(result);
				}

				return [];
			});
			
			const checkDuplicated = await weathers.find((weatherCached, key) => {
				if(weatherCached.name.toLowerCase() === weather.name.toLowerCase()){
					const changedKey = weathers.splice(key, 1)[0];
					weathers.unshift(changedKey);

					client.set("weathers", JSON.stringify(weathers), 'EX', 60 * 5);

					return true;
				}

				return false;
			});

			if(checkDuplicated){
				return response.status(202).send(weathers);
			}

			if(weathers.length && weathers.length >= 5){
				weathers.pop();
				weathers.unshift(weather);
			}else{
				weathers.unshift(weather);
			}

			client.set("weathers", JSON.stringify(weathers), 'EX', 60 * 5);

			return response.json(weathers);
		}catch(error){
			return response.status(500).send({
				error: true,
				message: "Sorry. A system problem has ocurred."
			});
		}
	}
}