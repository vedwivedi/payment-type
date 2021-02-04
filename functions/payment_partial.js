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

    Remember.repeat = false;
    Remember.userTotalBalance = Memory.userTotalBalance;
    Remember.payment_type = 2;
    Remember.from_task = "payment_partial";
    let collect_question="Please tell me the amount you want to pay."; // Default 
    if(Memory.say_err_msg!=undefined)
    collect_question=Memory.say_err_msg;  
    console.log("say_err_msg: "+Memory.say_err_msg);
    

    Collect = {
      "name": "collect_Payment_Amount",
      "questions": [
        {
          "question": collect_question,
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
  
  let RB = require(path);
  await RB.responseBuilder(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
  
    } catch (error) {  
    console.error(error);    
    callback( error);
  }
  };
  