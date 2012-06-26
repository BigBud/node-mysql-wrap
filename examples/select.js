var MySQL = require('../');

	MySQL.connect({
		"host" : "localhost",
		"user" : "test",
		"password" : "test",
		"database" : "test"
	});

var user, users;	

//users = (new MySQL()).select('id', 'login').from('users').fetch();
//console.log(users);

//users = (new MySQL()).from('users').fetch();
//console.log(users);

/*
users = (new MySQL()).select('id', 'login')
	.from('users')
	.where({ login: '"ivan"', password: '123456'})
	.fetch();

console.log(users);
*/
/*
users = (new MySQL()).select('id', 'login')
	.from('users')
	.where({ login: '"ivan"' }, { password: '123456'})
	.fetch();

console.log(users);
*/
/*
user = (new MySQL()).select('id', 'login')
	.from('users')
	.where({ login: '"ivan"' }, { password: '123456'})
	.limit(1)
	.fetch();
console.log(user);
*/
/*
users = (new MySQL()).select('id', 'login')
	.from('users')
	.where(['id', 'IN', [1, 2]])
	.fetch();

console.log(users);	
*/
