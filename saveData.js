var brain = require('brain');
var _ = require('underscore');
var training = require('./training');
var net = new brain.NeuralNetwork();

var input = {
	year: 2012,
	mileage: 100000,
	type: 'Audi',
	model: 'A4',
	engine_capacity: 1900,
};

training.generateData().then(function(data, formatter){

	var inputs = _.pluck(data, 'input');
	var types = _.pluck(inputs, 'type');

	console.log(types)
	console.log(types.filter(function(t){
		return t == "Dacia";
	}).length);

	var formatter = training.generateFormatter(data);

	data.forEach(function(sample, idx){
		data[idx].input = formatter(sample.input);
		sample.output.price = 100/sample.output.price; 
	})


	net.train(data);
	var output = net.run(formatter(input));
	console.log(100/output.price);

});
