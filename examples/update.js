var MySQL = require('../');

	MySQL.connect({
		"host" : "localhost",
		"user" : "test",
		"password" : "test",
		"database" : "test"
	});
	
var res = (new MySQL).update('users').set({password: 123}).where({id: 1}).exec();

console.log(res);