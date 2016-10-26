var mysql = require('./mysql');

var pendingRequests = []; //array of requests pending for a connection
var pendingRequestsSlots = 10;	 //Max allowed pending requests, any more requests will be looped every 5 ms
var assignedConnections = 0; //current active connections
var connStatus = []; //busy or free
var poolSize  = 0; // initial number of free connections
var allBusy = false; //flag to determine if new requests to be queued
var connectionArray = []; //array of connection objects


exports.createNewPool = function(num){
	poolSize = num;
	for(var i=0; i < poolSize; i++){
		var newConnectionObject = {
			connection : mysql.getConnection(),
			status : false
		};
		connectionArray.push(newConnectionObject);
	}
	console.log("Pool Created with capacity :"+poolSize);
};


exports.releaseConnection = function(conn_obj){
	assignedConnections--;
	for(var i=0; i<connectionArray.length;  i++){
		if(connectionArray[i].connection === conn_obj){
			connectionArray[i].status = false;
		}
	}
}


function assignConnection(){

	for(var i=0; i<poolSize; i++){
		if(connectionArray[i].status == false){
			allBusy = false;
			connectionArray[i].status = true;
			assignedConnections++;

			return connectionArray[i].connection;
		}

	}

	allBusy = true ;

}

exports.getPoolConnection = function getPoolConnection(callback){

	//if all existing connections are in use, try again after 10 milliseconds
	if(assignedConnections == connectionArray.length){
		//Check if Request queue is not full, then Push all new connection requests to a queue
		if(pendingRequestsSlots !=0 ){
			console.log("Pushing request to queue having remaining slots "+pndingCon_length);
			pendingRequests.push(pendingRequestsSlots);
			pendingRequestsSlots--;


			setInterval(function(){
				//if a connection becomes free, assign it
				if(!allBusy){
					console.log("Dequeing a connection request and processing it with current queue requests at"+pendingRequestsSlots);

					pendingRequests.splice(0, 1);

						//Ensuring Pending requests don't exceed queue capacity before freeing up a queue slot
						if(pendingRequestsSlots < 10)
							pendingRequestsSlots++;
						callback(assignConnection());
					}
				}, 10);		

			console.log("After timeout");
				}
				else{
				// no more requests to be accepted
				console.log("Request queue is full");
				callback(null);
			}


}
	else{
		console.log("Connection assigned");
		callback( assignConnection() );
	}
};



