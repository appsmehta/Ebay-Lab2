var ejs= require('ejs');
var mysql = require('mysql');
var winston = require('../log.js');
var pool = require('./sql_pool');

//Put your mysql configuration settings - user, password, database and port
exports.getConnection = function getConnection(){
	var connection = mysql.createConnection({
	    host     : 'localhost',
	    user     : 'apoorv',
	    password : 'root1234',
	    database : 'ebay_schema',
	    port	 : 3306
	});
	//console.log("get connection method " + connection.toString());
	return connection;
};


function fetchData(callback,sqlQuery){
	
	console.log("\nSQL Query::"+sqlQuery);
	
	var connection=this.getConnection();
	

			connection.query(sqlQuery, function(err, rows, fields) {
			if(err){
				console.log("ERROR: " + err.message);
			}
			else 
			{	// return err or result
				console.log("DB Results:"+rows);
				callback(err, rows);
			}
				console.log("\nConnection closed..");
				
		connection.end();
		});

			




	};
	
	
	


function fetchBlockingData(sqlQuery, callback){

console.log("\nSQL Query::"+sqlQuery);
	
	var connection=this.getConnection();
	
	connection.query(sqlQuery, function(err, rows, fields) {
		if(err){
			console.log("ERROR: " + err.message);
		}
		else 
		{	// return err or Results
			console.log("DB Results:"+JSON.stringify(rows, null, 2));
			callback(rows);
		}
		connection.end();
		console.log("\nConnection closed..");
	});



}

function storeData(callback,sqlQuery){
	
	console.log("\nSQL Query::"+sqlQuery);
	
	var connection=this.getConnection();
	
	connection.query(sqlQuery, function(err, rows, fields) {
		if(err){
			console.log("ERROR: " + err.message);
		}
		else 
		{	// return err or result
			console.log("DB Results:"+rows);
			callback(err, rows);
		}
	});
	console.log("\nConnection closed..");
	connection.end();
	
	
	
}


function updateData(callback,sqlQuery){

	console.log("update Query:"+sqlQuery);

	var connection = this.getConnection();

	connection.query(sqlQuery,function(err,rows,fields){

				if(err){
					console.log("ERROR: " + err.message);
				}
				else 
				{	// return err or result
					console.log("DB Results:"+rows);
					callback(err, rows);
				}
			});
			console.log("\nConnection closed..");
			connection.end();

	}





exports.storeData=storeData;
exports.fetchData=fetchData;
exports.updateData = updateData;
exports.fetchBlockingData = fetchBlockingData;