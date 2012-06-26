var MySQL = require('../');

	MySQL.connect({
		"host" : "localhost",
		"user" : "test",
		"password" : "test",
		"database" : "test"
	});

(new MySQL).insert('users', ['login', 'email', 'password'])
			.values(['sergey','sergey@mail.org','123456'], ['sergey','sergey@mail.org','123456'])
			.value('sergey','sergey@mail.org','123456').exec();