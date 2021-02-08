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

  let payment_amount=0.00;
  
  const dollars = event.Field_dollars_Value;
  const cents = event.Field_cents_Value;
  
  console.log("dollars: "+dollars+" cents: "+ cents);
  if(Memory.question==="payment_full" && Memory.payment_amount!=undefined) {
    payment_amount=Memory.payment_amount;
  } 
  else if ( dollars && cents ) {
    payment_amount = Number(dollars) + Number(cents) / 100;
  } 
  else if(Memory.twilio.collected_data.collect_Payment_Amount.answers.Payment_Amount.answer != undefined) {           
    payment_amount = Memory.twilio.collected_data.collect_Payment_Amount.answers.Payment_Amount.answer;
    console.log("payment_amount: "+payment_amount);
    if(payment_amount.includes("*"))
    {
      payment_amount =payment_amount.replace("*",".");
    }
    payment_amount=Number(payment_amount).toFixed(2)
  }  
  console.log("payment_amount: "+payment_amount);
  console.log("Memory.userTotalBalance: "+Memory.userTotalBalance);
  if ( payment_amount >= 25 && payment_amount <= Number(Memory.userTotalBalance) ) {
      Say = `Your payment amount is $${payment_amount}. Do you want to change the amount.`;
      
      Remember.payment_amount = payment_amount;
      Remember.question = 'payment_amount_check';
    
      Listen = true;
      Tasks=['yes_no', 'agent_transfer', 'payment_partial'];
  } 
  else if ( payment_amount < 25 ) {
      Say = `You entered the payment amount $${payment_amount} is less than $25, we accept only amount $25 or more. `;      
      Listen = false;      
      Redirect="task://payment_partial";

  } 
  else if ( payment_amount > Number(Memory.userTotalBalance) ) {
      Say = `You entered the payment amount $${payment_amount} is more than your balance amount. `; 
      Listen = false;
      Redirect="task://payment_partial";
  }  

  //End of your code.
  
  // This callback is what is returned in response to this function being invoked
const functions = Runtime.getFunctions();
let path = functions['responseBuilder'].path;
let RB = require(path);
await RB.responseBuilder(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
  
  } catch (error) {  
  console.error(error);    
  callback( error);
}
};
