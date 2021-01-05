// This is your new function. To start, set the name and path on the left.

exports.collect_partial_Amount =async function(context, event, callback) {
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

  const dollars = event.Field_dollars_Value;
  const cents = event.Field_cents_Value;
  
  let userTotalBalance=800.00; // Default Amount for testing
  if(Memory.userTotalBalance!=undefined)
    userTotalBalance=Number(Memory.userTotalBalance).toFixed(2);  
  console.log("AmountPay "+userTotalBalance);
  
  if ( dollars && cents ) {
    const payment_amount = Number(dollars) + Number(cents) / 100;

    if ( payment_amount >= 5 && payment_amount <= userTotalBalance ) {
      Say = `Your payment amount is ${payment_amount} US dollars. `;
      Prompt = `Do you want to proceed?`;
    
      Say += Prompt;
      
      Remember.payment_amount = payment_amount;
      Remember.question = 'payment_amount_check';
    
      Listen = true;
      Tasks=['yes_no', 'agent_transfer'];
    } else if ( payment_amount < 5 ) {
      Say = `Your payment amount is less than 5 US dollars, we accept only amount 5 US dollars or more. `;
      Prompt = `Do you want to provide a new amount?`;
    
      Say += Prompt;
      
      Remember.question = 'payment_amount_incorrect';
    
      Listen = true;
      Tasks=['yes_no', 'agent_transfer'];
    } else if ( payment_amount > userTotalBalance ) {
      Say = `Your payment amount is more than your balance amount. `;
      Prompt = `Do you want to provide a new amount?`;
    
      Say += Prompt;
      
      Remember.question = 'payment_amount_incorrect';
    
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
    let requestObj= {
      Say: Say,
      Listen:Listen,
      Remember:Remember,
      Collect:Collect,
      Tasks:Tasks,
      Redirect:Redirect,
      Handoff:Handoff,
      callback:callback
    };
  let API_responseBuilder = context.fnURL + 'responseBuilder';
  console.log(API_responseBuilder);
 let responseObj = await axios.post(API_responseBuilder, requestObj, {headers: { 'Content-Type': 'application/json'}});
 //console.log(JSON.stringify(responseObj));
  callback(null, responseObj.data);
  } catch (error) {  
  console.error(error);    
  callback( error);
}
};
