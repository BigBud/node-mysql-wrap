var MySQL = require('../');

	MySQL.connect({
		"host" : "localhost",
		"user" : "test",
		"password" : "test",
		"database" : "test"
	});

var user;

/*****************************************************************/
users = (new MySQL).insert('users', ['login', 'email', 'password'])
			.values(['sergey','sergey@mail.org','123456'], ['sergey','sergey@mail.org','123456'])
			.value('sergey','sergey@mail.org','123456');

console.log(1, users.toString());
//users.exec();

/*****************************************************************/
users = (new MySQL).insert('users')
			.set({
				login: '"serge"',
				email: '"sergey@mail.org"',
				password: '123456'
			});

console.log(2, users.toString());
//users.exec();