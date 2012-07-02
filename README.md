## Connect

```js
var MySQL = require('node-mysql-wrap');

MySQL.connect({
	"host" : "localhost",
	"user" : "test",
	"password" : "test",
	"database" : "test"
});
```
##select

return array
```js
(new MySQL()).select('col_1', 'col_2').from('table').fetch();
```

return object 
```js
(new MySQL()).select('col_1', 'col_2').from('table').limit(1).fetch();
```

##join 
```js
(new MySQL()).select('col_1', 'col_2')
	.from('table')
	.left() // maybe right|inner|outer|cross|left OR together
	.join('table_2').on(expression)
	.limit(1).fetch();
```

##update
```js
(new MuSQL()).update('table').set({col_1: 2}).exec();
```

##insert
```js
var lastInsertId = (new MySQL()).insert('table', ['col_1', 'col_2']).value('1', '2');

var lastInsertId = (new MySQL()).insert('table').set({
						col_1: '"value"', // if string use two quotes
						col_2: 1
					})
```

##fetch
```js
rows = [];

var callback = function(row) {
	rows.push(row);	
}

(new MySQL()).select('col_1', 'col_2').from('table').fetch(callback);
```

##show query
```js
(new MySQL()).select('col_1', 'col_2').from('table').where(expression).toString();
```

##expression

col = value
```js
{ col: value }
```

col !=|>=|...|OR|AND... value
```js
['col', 'operation', 'value']
```

more complex condition example
```js
[['col_2', '>=', 2], 'OR', ['col_1', '!=', 1]]
```
((col2 >= 2) OR (col_1 != 1)
