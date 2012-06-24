var MySQL = require('../');

	MySQL.connect({
		"host" : "localhost",
		"user" : "test",
		"password" : "test",
		"database" : "test"
	});
	
var cats; 

cats = (new MySQL())
	.select('pets.*, users.login').from('pets')
	.left().join('users').on({'pets.user_id': 'users.id'})
	.fetch();

console.log(cats);
