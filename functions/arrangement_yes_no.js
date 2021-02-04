// This is your new function. To start, set the name and path on the left.

exports.arrangement_yes_no =async function(context, event, callback) {
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
  
    
    Remember.repeat = false;
    Remember.question="payment_arrangement";
    Remember.payment_type = 3; 
    
    Say = `Do you want to make a payment arrangement, say yes or No. you can also press 1 for yes and 2 for no.`;  
    Listen = {
        "voice_digits": {
          "num_digits": 1,
          "finish_on_key": "#",
          "redirects": {
            1: "task://payment_arrangement",
            2: "task://agent_transfer"
          }            
        }
      };   
          
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
  