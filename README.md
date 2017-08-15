# cordova-plugin-db
Abstraction layer above WebSQL with the purpose of simplifying database structure changes.

This project is in development. Use with caution.

<code>Db.open("sample", "Sample", 1024 * 1024);
Db.addStep(1, function() {
	Db.transaction(function(tx) {
		Db.execute(tx, "CREATE TABLE test (first INT);", [], null, null);
		Db.execute(tx, "INSERT INTO test (first) VALUES('1');")
	});
});
Db.addStep(2, function() {
	Db.transaction(function(tx) {
		Db.execute(tx, "ALTER TABLE test ADD COLUMN second INT;", [], null, null);
	});
});
Db.addStep(3, function() {
	Db.transaction(function(tx) {
		Db.execute(tx, "ALTER TABLE test ADD COLUMN third INT;", [], null, null);
	});
});
Db.run(function() {
	console.log("success");
}, function(error) {
	console.warn(error.message);
});</code>
