var MySQL = require('../');

	MySQL.connect({
		"host" : "localhost",
		"user" : "test",
		"password" : "test",
		"database" : "test"
	});
	
var cats = []; 

var res = (new MySQL())
	.select('pets.*, users.login').from('pets')
	.left().join('users').on({'pets.user_id': 'users.id'})
	.fetch(function(cat) {
		cats.push(cat);
	});

console.log(res, cats);
