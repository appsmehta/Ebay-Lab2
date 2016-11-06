var dateFormat = require('dateformat');
var mUtility = require('./mUtility');
function myfunction(counterName) {
mUtility.getNewNextSequence(counterName,function(value){
	console.log("found next product: ");
	console.log(value);
});
}
myfunction("ordercounter");