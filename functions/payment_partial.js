// This is your new function. To start, set the name and path on the left.

exports.payment_partial =async function(context, event, callback) {
    try {
    let Say;
    let Prompt;
    let Listen = false;
    let Collect = false;
    let Remember = {};
    let Tasks = false;
    let Redirect = false;
    let Handoff = false;
    
    const Memory = JSON.parse(event.Memory);
  
    Remember.task_fail_counter = 0;
    Remember.repeat = false;
    Remember.userTotalBalance=Memory.userTotalBalance;
    Remember.payment_type = 'partial';
    //const payment_type = event.Field_payment_type_Value;
    
    // Say = `You will now be asked to tell me the specific amount of your payment including both dollars and cents. `;
    // Prompt = `Please tell me the payment amount now.`;
	  // Say += Prompt;
    // Redirect="task://collect_partial_Amount";
    // Remember.payment_type = 'partial';     
    // Listen = true;
        // Tasks=['payment_Method'];

      Collect =  {
          "name": "collect_Payment_Amount",
          "questions": [
            {
              "question": "Please enter or say the amount you want to pay. Example, you can say 50 dollars and 25 cents.",
              "name": "Payment_Amount",
              "type": "Twilio.NUMBER",
              "voice_digits": {
                "num_digits": 10,
                "finish_on_key": "#",                
              }
            }
          ],
          "on_complete": {
            "redirect": 
              "task://collect_partial_Amount"            
          }
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
  