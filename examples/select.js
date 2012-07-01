var MySQL = require('../');

	MySQL.connect({
		"host" : "localhost",
		"user" : "test",
		"password" : "test",
		"database" : "test"
	});


var user, users;	

/*****************************************************************/
users = (new MySQL()).select('id', 'login').from('users');

console.log(1, users.toString());
//users.fetch();

/*****************************************************************/
users = (new MySQL()).select('*').from('users');

console.log(2, users.toString());
//users.fetch();

/*****************************************************************/
users = (new MySQL()).select('id', 'login')
	.from('users')
	.where({ login: '"ivan"', password: '123456'});

console.log(3, users.toString());
//users.fetch();

/*****************************************************************/
users = (new MySQL()).select('id', 'login')
	.from('users')
	.where({ login: '"ivan"' }, { password: '123456'});

console.log(4, users.toString());
//users.fetch();

/*****************************************************************/
user = (new MySQL()).select('id', 'login')
	.from('users')
	.where({ login: '"ivan"'})
	.where({ password: '123456'})
	.limit(1);

console.log(5, user.toString());
//user.fetch();

/*****************************************************************/
users = (new MySQL()).select('*')
	.from('users')
	.where(['id', 'IN', [1, 2, 3]]);

console.log(6, users.toString());
//users.fetch();

/*****************************************************************/
users = (new MySQL()).select('*')
	.from('users')
	.where([['id', '=', 1], 'OR', ['id', '=', 2]]);

console.log(7, users.toString());
//users.fetch();
