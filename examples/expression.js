var Expr = require('../lib/expression');

var expr = new Expr();

expr.push('name LIKE "%ivan%"');
expr.push(['login', '=', '1']);
expr.push([['id', '=', 1],'OR',['id', '=', 2]]);
expr.push(['id', 'BETWEEN', [1, 'AND', 2]]);
expr.push(['', '!', 1]);

console.log(expr.toString());

