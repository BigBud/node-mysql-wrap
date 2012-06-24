var Client = require('mysql-libmysqlclient');

var MySQL = function() { 
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
	}
});

MySQL.fn.extend({
	select: function()	{
		this.select.expr = Array.prototype.slice.call(arguments);
	
		return this;
	},
	
	from: function() {
		this.table_references = arguments[0]; 
	
		return this;
	},
	
	where: function() {
		if (arguments.length > 0) {
			this.where.condition = Array.prototype.slice.call(arguments);
			return this;
		} 	

		var _condition = [];
		
		this.where.condition.forEach(function(condition){
			for (var name in condition) {
				_condition.push(name + " = '" + condition[name] + "'");
			}
		});

		return _condition.join(' AND ');
	},
	
	limit: function() {
		this.limit.offset = arguments.length > 1 ? arguments[0] : 0;
		this.limit.row_count = arguments.length > 1 ? arguments[1] : arguments[0];
		
		return this;
	},
	
	fetch: function() {
		console.log(this.toString());

		var result = MySQL.instance.querySync(this.toString());

		if (result) {
			
			if (this.limit.row_count == 1) return result.fetchObjectSync();
			
			return result.fetchAllSync();
			//return result.fetchArraySync();
			//return result.fetchFieldSync();
			//return result.fetchFieldDirectSync();
			//return result.fetchFieldsSync();
			//return result.fetchLengthsSync();
			
		}
		
		return false;
	},
	
	toString: function() {
		var sql = "SELECT " + this.select.expr.join(',') + " "
				+ "FROM " + this.table_references + " "
				+ (this.where.condition ? "WHERE " + this.where() : "");
			
		return sql;
	}
})

module.exports = MySQL;