(function(){
	var Negotiator = require('../lib/negotiator');
	var negotiator = new Negotiator({
		headers: {
			'accept-language': 'en-US, en;q=0.8'
		}
	});
	this["Should return the fallback when no match is found"] = function(test){
		test.deepEqual(negotiator.preferredLanguage([], 'de'), 'de');
		return test.done();
	};
}).call(this);