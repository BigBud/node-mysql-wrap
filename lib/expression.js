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
			
			if (Array.isArray(value[0])) value[0] = func(value[0]);
			if (Array.isArray(value[2])) value[2] = func(value[2]);

			return "(" + value.join(' ') + ")";
		}

		return this.store.map(func).join(' AND ');
	}
}

module.exports = Expr;