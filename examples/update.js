var MySQL = require('../');

	MySQL.connect({
		"host" : "localhost",
		"user" : "test",
		"password" : "test",
		"database" : "test"
	});
	
var users;

/*****************************************************************/
users = (new MySQL).update('users')
			.set({password: 123, login: '"ivan"'})
			.where({id: 1});

console.log(1, users.toString());
//users.exec();