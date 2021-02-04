// This is your new function. To start, set the name and path on the left.

exports.partial_yes_no =async function(context, event, callback) {
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
  
    
    Remember.repeat = false;
    Remember.question="payment_partial";
    Remember.payment_type = '2';
    
    Say = `Do you want to pay less than your full balance, say yes or No. you can also press 1 for yes and 2 for no.`;     
    Listen = {
          "voice_digits": {
            "num_digits": 1,
            "finish_on_key": "#",
            "redirects": {
              1: "task://payment_partial",
              2: "task://arrangement_yes_no"
            }            
          }
        };
    
    //End of your code.
    
    // This callback is what is returned in response to this function being invoked.
  const functions = Runtime.getFunctions();
  let path = functions['responseBuilder'].path;
  let RB = require(path);
  await RB.responseBuilder(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
  
    } catch (error) {  
    console.error(error);    
    callback( error);
  }
  };
  