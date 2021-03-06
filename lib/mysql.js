var crypto = require('crypto'),
	
	Client = require('mysql-libmysqlclient'),
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
	init: function(){},

	connect: function(DB, init) {
		this.DB = DB;
		this.init = init;

		this.reconnect();
	},

	reconnect: function() {
		MySQL.instance = Client.createConnectionSync();
		MySQL.instance.connectSync(MySQL.DB.host, MySQL.DB.user, MySQL.DB.password, MySQL.DB.database);

		MySQL.init();
	},
	
	expr: function(v, n) {
		if (n == 100) new Error('Keep it simple');
		
		for (var i in v) {
			if (Array.isArray(v[i])) 
				this.push(v[i]);
			else if (typeof v[i] == 'string' || typeof v[i] == 'number') 
				this.push(n ? [i, '=', v[i]] : v[i]);
			else if (typeof v[i] == 'object')
				MySQL.expr.call(this, v[i], ++n);
		}
	},

	escape: function(s) {
		return MySQL.instance.escapeSync(s);
	},

	MD5: function(str) {
		return crypto
					.createHash('md5')
					.update(str)
					.digest('hex');
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

		var arguments = Array.prototype.slice.call(arguments);

		if (this.select_expr)
			this.select_expr = this.select_expr.concat(this.select_expr, arguments);
		else
			this.select_expr = arguments;

		return this;
	},
	
	update: function() {
		this.type = 'update';
		this.table_references = Array.prototype.slice.call(arguments);
		
		return this;
	},

	insert: function() {
		this.type = 'insert';
		this.table_references = Array.prototype.slice.call([arguments[0]]);
		this.cols = arguments[1];
		return this;
	},

	delete: function() {
		this.type = 'delete';
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

	value: function() { 
		return this.values(Array.prototype.slice.call(arguments)); 
	},
	
	values: function() {
		if (arguments.length > 0) {
			if (!this.values_expr) this.values_expr = new Expr();
			
			MySQL.expr.call(this.values_expr, arguments, 0);
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
	
	order: function() {
		this.order_by = arguments[0];
		
		return this;
	},
	
	group: function() {
		this.group_by = arguments[0];
		
		return this;
	},
	
	exec: function(query, flag) {
		var result;

		// Восстанавливаем соединение если оно было оборвано		
		if (!MySQL.instance.pingSync()) MySQL.reconnect();

		try {
			result = MySQL.instance.querySync(query || this.toString());
		} catch (e) {
			console.log(e);
		}
		
		if (result) {
			if ( this.type == 'insert' && (MySQL.getLastInsertId || flag) )
				result = MySQL.instance.lastInsertIdSync();
			else
			if ( this.type == 'update' || this.type == 'delete' && (MySQL.getAffectedRows || flag))
				result = MySQL.instance.affectedRowsSync();
		}

		return result; //MysqlResult
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
});

Create.select = function() {
	var sql = "SELECT " + this.select_expr.join(',') + " "
			+ (this.table_references ? "FROM " + this.table_references.join(' ') : "") + " "
			+ (this.where_condition ? "WHERE " + this.where_condition.toString() : "")
			+ (this.group_by ? " GROUP BY " + this.group_by : "")
			+ (this.order_by ? " ORDER BY " + this.order_by : "")
			+ (this.limit_row_count ? " LIMIT " + this.limit_offset + ", " + this.limit_row_count : "");
			
	return sql;
};

Create.update = function() {
	var sql = "UPDATE " + this.table_references.join(' ')
			+ (this.set_expr ? ' SET ' + this.set_expr.toString(', ', '', '') : '')
			+ (this.where_condition ? ' WHERE ' + this.where_condition.toString() : '')
			+ (this.order_by ? ' ORDER BY ' + this.order_by : '')
			+ (this.limit_row_count ? ' LIMIT ' + this.limit_row_count : '');
	
	return sql; 
};

Create.insert = function() {
	var sql = 'INSERT INTO ' + this.table_references.join(' ')
			+ (this.cols ? ' (' + this.cols.join(', ') + ')' : '')
			+ (this.values_expr ? ' ' + (this.values_expr.length == 1 ? 'VALUE' : 'VALUES') + ' ' + this.values_expr.toString(', ', '(', ')', ', ') + ' ' : '')
			+ (this.set_expr ? ' SET ' + this.set_expr.toString(', ', '', '') : '');

	return sql;
};

Create.delete = function() {
	var sql = 'DELETE FROM ' + this.table_references.join(' ')
			+ (this.where_condition ? ' WHERE ' + this.where_condition.toString() : '')
			+ (this.order_by ? ' ORDER BY ' + this.order_by : '')
			+ (this.limit_row_count ? ' LIMIT ' + this.limit_row_count : '');

	return sql;
};

module.exports = MySQL;