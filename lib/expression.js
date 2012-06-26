var Expr = function() {
	this.store = [];
};

Expr.prototype = {
	push: function() {
		this.store.push(arguments[0]);
	},
	
	toString: function(glue, g1, g2) {
		g1 = g1 != undefined ? g1 : '(';
		g2 = g2 != undefined ? g2 : ')';

		var func = function(value) {	
			if (!Array.isArray(value)) return value;

			if (Array.isArray(value[0])) value[0] = func(value[0], Expr[value[1]]);
			if (Array.isArray(value[2])) value[2] = func(value[2], Expr[value[1]]);

			var glue = arguments.length == 2 ? arguments[1] : ' ';

			return g1 + value.join(glue) + g2;
		}

		return this.store.map(func).join(glue || ' AND ');
	}
}

Expr['IN'] = ', ';

module.exports = Expr;