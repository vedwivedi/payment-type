const functions = Runtime.getFunctions();
let greeting = require(functions['greeting'].path);
let payment_full = require(functions['payment_full'].path);
let payment_partial=require(functions['payment_partial'].path);
let payment_type = require(functions['payment_type'].path);
let collect_partial_Amount = require(functions['collect_partial_Amount'].path);
let responseBuilder = require(functions['responseBuilder'].path);
let yes_no = require(functions['yes_no'].path);

exports.handler = async (context, event, callback) => {
 
  const { CurrentTask } = event;
  const {CurrentTaskConfidence} = event;
  console.log("CurrentTask: "+CurrentTask);
  console.log("CurrentTaskConfidence: "+CurrentTaskConfidence);
  // calling task handlers
  switch (CurrentTask) {
    case 'greeting':
    {
      console.log("CurrentTask: "+CurrentTask );      
      await greeting.greeting(context, event, callback);
      break;
    }
    case 'payment_full':
    {
      console.log("CurrentTask: "+CurrentTask );      
      await payment_full.payment_full(context, event, callback);
      break;
    }
    case 'payment_partial':
    {
      console.log("CurrentTask: "+CurrentTask );      
      await payment_partial.payment_partial(context, event, callback);
      break;
    }
    case 'payment_type':
    {
      console.log("CurrentTask: "+CurrentTask );      
      await payment_type.payment_type(context, event, callback);
      break;
    }
    case 'collect_partial_Amount':
    {
      console.log("CurrentTask: "+CurrentTask );
      await collect_partial_Amount.collect_partial_Amount(context, event, callback);
      break;
    } 
    case 'yes_no':
    {
      console.log("CurrentTask: "+CurrentTask );
      await yes_no.yes_no(context, event, callback);
      break;
    }   

    default:
      await payment_type.payment_type(context, event, callback);
      break;
  }
};