// This is your new function. To start, set the name and path on the left.

exports.payment_partial =async function(context, event, callback) {
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
    Remember.question="payment_partial";
    //const payment_type = event.Field_payment_type_Value;
    
    
    Say = "Do you want to pay less than your full balance, say yes or No. you can also press 1 for yes and 2 for no.";
     Redirect="task://payment_partial";
     Remember.payment_type = 'partial';
     
  
        Listen = true;
        Tasks=['payment_Method'];
        
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
  