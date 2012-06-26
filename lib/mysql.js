var Client = require('mysql-libmysqlclient'),
	Expr = require('./expression'),
	
	Create = {}, 
	
	MySQL = function() { 
		return new MySQL.fn.init();
	};

MySQL.fn = MySQL.prototype = {
	init: function() {

	}
};

MySQL.fn.init.prototype = MySQL.fn; 

MySQL.fn.extend = MySQL.extend = function() {
	var that = this,
	data = arguments[0];

	for (var name in data) 			
		that[name] = data[name]; 
};

MySQL.extend({
	instance: null,
	
	connect: function(c) {
		MySQL.instance = Client.createConnectionSync();
		MySQL.instance.connectSync(c.host, c.user, c.password, c.database);
		MySQL.instance.querySync("SET NAMES `utf8`");
	},
	
	expr: function(v, n) {
		if (n == 100) new Error('Keep it simple');
		
		for (var i in v) {
			if (Array.isArray(v[i])) 
				this.push(v[i]);
			else if (typeof v[i] == 'string' || typeof v[i] == 'number') {
				if (n) 
					this.push([i, '=', v[i]]);
				else 
					this.push(v[i]);
			}
			else if (typeof v[i] == 'object')
				MySQL.expr.call(this, v[i], ++n);
		}
	}
});

var join_type = function(type) {
	return function() {
		this.table_references.push(type);
		return this;
	}
}

MySQL.fn.extend({
	select: function()	{
		this.type = 'select';
		this.select_expr = Array.prototype.slice.call(arguments);
	
		return this;
	},
	
	update: function() {
		this.type = 'update';
		this.table_references = Array.prototype.slice.call(arguments);
		
		return this;
	},

	from: function() {
		this.table_references = Array.prototype.slice.call(arguments); 
	
		return this;
	},
	
	left: join_type('LEFT'),
	right: join_type('RIGHT'),
	inner: join_type('INNER'),
	outer: join_type('OUTER'),
	cross: join_type('CROSS'),
		
	join: function() {
		this.table_references.push("JOIN " + arguments[0]);
		return this;
	},

	on: function() {
		if (arguments.length > 0) {
			var _condition = new Expr(); 
			
			MySQL.expr.call(_condition, arguments, 0);
			
			this.table_references.push("ON " + _condition.toString());
		}
		
		return this;
	},	

	set: function() {
		if (arguments.length > 0) {
		
			if (!this.set_expr) this.set_expr = new Expr();			
		
			MySQL.expr.call(this.set_expr, arguments, 0);
		} 	
		
		return this;
	},

	where: function() {
		
		if (arguments.length > 0) {
		
			if (!this.where_condition) this.where_condition = new Expr();			
			
			MySQL.expr.call(this.where_condition, arguments, 0);
		} 	

		return this;
	},
	
	limit: function() {
		this.limit_offset = arguments.length > 1 ? arguments[0] : 0;
		this.limit_row_count = arguments.length > 1 ? arguments[1] : arguments[0];
		
		return this;
	},
	
	exec: function() {
		console.log(this.toString());
		
		var result = false;
		
		try {
			result = MySQL.instance.querySync(this.toString());
		} catch (e) {
			console.log(e);
		}
		
		return result;
	},

	fetch: function(callback) {
		var result = this.exec();

		if (result) {
		
			if (callback) {
				var row; 
				
				while(row = result.fetchObjectSync()) {
					callback.apply(this, [row]);
				}
				
				return true;
			}

			if (this.limit_row_count == 1) return result.fetchObjectSync();
			
			return result.fetchAllSync();			
		}
		
		return false;
	},

	toString: function() {
		return Create[this.type].call(this);
	}
})

Create.select = function() {
	var sql = "SELECT " + this.select_expr.join(',') + " "
			+ "FROM " + this.table_references.join(' ') + " "
			+ (this.where_condition ? "WHERE " + this.where_condition.toString() : "");
	
	return sql;
}

Create.update = function() {
	var sql = "UPDATE " + this.table_references.join(' ') + " "
			+ "SET " + this.set_expr.toString(', ', '', '') + " "
			+ (this.where_condition ? "WHERE " + this.where_condition.toString() : ""); 
	
	return sql; 
}

module.exports = MySQL;