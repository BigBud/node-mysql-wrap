var Expr = function() {
	this.store = [];
};

Expr.prototype = {
	push: function() {
		this.store.push(arguments[0]);
	},
	
	toString: function() {
		var func = function(value) {	
			if (!Array.isArray(value)) return value;

			if (Array.isArray(value[0])) value[0] = func(value[0], Expr[value[1]]);
			if (Array.isArray(value[2])) value[2] = func(value[2], Expr[value[1]]);

			var split = arguments.length == 2 ? arguments[1] : ' ';

			return "(" + value.join(split) + ")";
		}

		return this.store.map(func).join(' AND ');
	}
}

Expr['IN'] = ', ';

module.exports = Expr;