function Db() {
	var self = this;
	var mWebSql = null;
	var mSteps = [];

	this.open = function(name, displayName, estimatedSize) {
		mWebSql = window.openDatabase(name, "", displayName, estimatedSize);
	};

	this.addStep = function(step, func) {
		mSteps[step] = func;
	};

	this.run = function(successCallback, errorCallback) {
		var version = parseInt(mWebSql.version) || 0;
		self.migrate(version + 1, successCallback, errorCallback);
	};

	this.migrate = function(step, successCallback, errorCallback) {
		if (mSteps[step]) {
			mWebSql.changeVersion(mWebSql.version, String(step), function(t) {
				mSteps[step](t);
			}, function(error) {
				if (errorCallback) {
					errorCallback(error);
				}
			}, function() {
				self.migrate(step + 1, successCallback, errorCallback);
			});
		} else {
			if (successCallback) {
				successCallback();
			}
		}
	};

	this.query = function(sql, params, successHandler, errorHandler) {
		mWebSql.readTransaction(function(tx) {
			tx.executeSql(sql, params, function(tx, result) {
				if (successHandler) {
					successHandler(result);
				}
			}, function(transaction, error) {
				if (errorHandler) {
					errorHandler(error);
				}
			});
		});
	};

	this.transaction = function(callback) {
		mWebSql.transaction(function(tx) {
			callback(tx);
		});
	};

	this.execute = function(tx, sql, params, successHandler, errorHandler) {
		tx.executeSql(sql, params, function(tx, result) {
			if (successHandler) {
				successHandler(result);
			}
		}, function(transaction, error) {
			if (errorHandler) {
				errorHandler(error);
			}
		});
	};
}

module.exports = new Db();
