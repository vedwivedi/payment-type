// This is your new function. To start, set the name and path on the left.

exports.payment_type =async function(context, event, callback) {
  try {
	let Say;
  let Prompt;
  let Listen = true;
  let Collect = false;
  let Remember = {};
  let Tasks = false;
  let Redirect = false;
  let Handoff = false;
  
  const Memory = JSON.parse(event.Memory);

  Remember.task_fail_counter = 0;
  Remember.repeat = false;

  const payment_type = event.Field_payment_type_Value;
  
  let userTotalBalance=800.00; // Default Amount for testing
  if(Memory.userTotalBalance!=undefined)
    userTotalBalance=Number(Memory.userTotalBalance).toFixed(2);  
  console.log("AmountPay "+userTotalBalance);
  console.log("Memory.userTotalBalance: "+Memory.userTotalBalance);

  if ( payment_type ) {
    if ( payment_type  === 'full' ) {
      
      Say = `You have selected to pay your full balance.`;
      //Prompt = `Please tell me the payment Method now.`;

      //Say += Prompt;
      
      
        Remember.payment_type = 1;
        Remember.payment_amount = userTotalBalance;

      Listen = false;
      //Tasks=['payment_Method'];
      
        
      
    } else if ( payment_type === 'partial' ) {
      Redirect="task://payment_partial";
      Listen = false;
      // Tasks=['partial_payment'];
    } else if ( payment_type === 'arrangement' ) {
      
      Say ="";
      
      Remember.payment_type = 3;

      Listen = false;
      //Tasks=['yes_no', 'agent_transfer'];
    }
  } else {
    Say = false;
    Listen = false;
    Remember.from_task = event.CurrentTask;
    Redirect = 'task://fallback';
  }
  
  //End of your code.
  
  // This callback is what is returned in response to this function being invoked.
const functions = Runtime.getFunctions();
let path = functions['responseBuilder'].path;
//console.log("path:"+path);
let RB = require(path);
await RB.responseBuilder(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);

  } catch (error) {  
  console.error(error);    
  callback( error);
}
};
