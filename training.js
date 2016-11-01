var cheerio = require('cheerio');
var request = require('sync-request');
var _ = require('underscore');

var urls = [];

for(i=1; i<=650;i++)
	urls.push('http://autovit.ro/autoturisme/?page='+ i);

console.log(urls);

var scale = function(x, min, max) {

};

var addKeys = function(to, keys, v) {
	keys.forEach(function(key){
		to[key] = key == v ? 1 : 0;
	})
}

var it = 1;

module.exports.generateFormatter = function(data) {

	var inputs = _.pluck(data, 'input');

	// var max_year = _.max(_.pluck(inputs, 'year'));
	// var min_yeat = _.min(_.pluck(inputs, 'year'));

	// var max_mileage = _.max(_.pluck(inputs, 'mileage'));
	// var min_mileage = _.min(_.pluck(inputs, 'mileage'));

	// var max_engine_capacity = _.max(_.pluck(inputs, 'engine_capacity'));
	// var min_engine_capacity = _.min(_.pluck(inputs, 'engine_capacity'));

	var all_types =  _.uniq(_.pluck(inputs, 'type'))
	var all_models =  _.uniq(_.pluck(inputs, 'model'))

	return function(input) {
		var model = input.model;
		var type = input.type;
		delete input.model;
		delete input.type;
		addKeys(input, all_types, type);
		addKeys(input, all_models, model);
		input.year = 100/input.year;
		input.mileage = 100/input.mileage;
		input.engine_capacity = 100/input.engine_capacity;
		return input;
	}

};

module.exports.generateData = function() {
	return new Promise(function(fullfill, reject){
		var all_data = [];
		
		urls.forEach(function(url){
			var data = [];

			var req = request('GET', url);
			var body = req.getBody().toString();
			
			var $ = cheerio.load(body);
			console.log(it++);
			$("article.offer-item").each(function(idx, block){
				
				var input = {}, output = {};
				output.price = parseInt(
					$(block).find("span.offer-price__number").text().trim().replace(" ", ""));
				input.year = parseInt(
					$(block).find("li.offer-item__params-item[data-code='year']").text().trim().replace(" ", ""));
				input.mileage = parseInt(
					$(block).find("li.offer-item__params-item[data-code='mileage']").text().trim().replace(" ", ""));
				input.engine_capacity = parseInt(
					$(block).find("li.offer-item__params-item[data-code='engine_capacity']")
					.text()
					.trim()
					.replace(" ", "")
					.replace("cm3", ""));
				
				var title_parts = $(block).find('h2.offer-title a').attr('title').trim().split(" ");
				input.type = title_parts.shift();
				input.model = title_parts.join(" ");

				data.push({
					input: input,
					output: output,
				});
			});


			all_data = all_data.concat(data);	
		});

		fullfill(all_data);

	});
};
