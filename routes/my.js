var dateFormat = require('dateformat');
var mUtility = require('./mUtility');
function myfunction() {

/*var posted_at = new Date();
		var expires_at = new Date();
		expires_at=expires_at.setTime(posted_at.getTime() + (4*86400000));
		posted_at = dateFormat(posted_at, "yyyy:mm:dd HH:MM:ss");	
		expires_at = dateFormat(expires_at, "yyyy:mm:dd HH:MM:ss");

		console.log(posted_at +" expires at: "+expires_at);
*/
console.log("Next product is : "+mUtility.getNextSequence("product_id"));
}

myfunction();