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

  if ( payment_type ) {
    if ( payment_type  === 'full' ) {
      
        Say = `To pay the amount of $ ${userTotalBalance}. `;
      Prompt = `Please tell me the payment Method now.`;

      Say += Prompt;
      
      
        Remember.payment_type = 'full';
        Remember.payment_amount = userTotalBalance;

      Listen = true;
      Tasks=['payment_Method'];
      
        
      
    } else if ( payment_type === 'partial' ) {
      Say = `You will now be asked to tell me the specific amount of your payment including both dollars and cents. `;
      Prompt = `Please tell me the payment amount now.`;

      Say += Prompt;
      
      Remember.payment_type = 'partial';

      Listen = true;
      Tasks=['partial_payment'];
    } else if ( payment_type === 'arrangement' ) {
      Say = `We can split the balance in half which will make your payments each at ${userTotalBalance / 2} dollars. `;
      Prompt = `Would you like to set this up now? say yes to confirm or no to look at another option.`;

      Say += Prompt;
      
      Remember.payment_type = 'arrangement';
      Remember.question = 'split_balance';

      Listen = true;
      Tasks=['yes_no', 'agent_transfer'];
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
