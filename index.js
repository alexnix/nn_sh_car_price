var brain = require('brain');
var net = new brain.NeuralNetwork();
var fs = require('fs');

var input = {
	year: 100/2012,
	mileage: 100/100000,
	'Audi': 1,
	'A4': 1,
	engine_capacity: 100/1900,
};

fs.readFile(__dirname + '/data.txt', function(err, data){
	console.log('file read');
	var json_data = JSON.parse(data);
	console.log('traing...');
	net.train(json_data);
	var out = net.run(input);

	console.log(100/out.price);

})