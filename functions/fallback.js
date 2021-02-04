
// fallback handler function
exports.fallback =async function(context, event, callback) {
    const functions = Runtime.getFunctions();
    let path = functions['responseBuilder'].path;
    let RB = require(path);
    
    let Say = false;
    let Listen = true;
    let Remember = {};
    let Collect = false;
    let Tasks = false;
    let Redirect = false;
    let Handoff = false;
  
    console.log('Fallback Triggered.');
  
    const Memory = JSON.parse(event.Memory);
    console.log("Memory: "+JSON.stringify(Memory));   
    const from_task = Memory.from_task;

    if (Memory.task_fail_counter === undefined) // new line add
    Remember.task_fail_counter = 1;
  else
    Remember.task_fail_counter = Number(Memory.task_fail_counter) + 1;
  
    if (Memory.task_fail_counter > 3) {
      Say = false;
      Listen = false;
      Remember.task_fail_counter = 0;
      Redirect = 'task://agent_transfer';
    } else {
      console.log("from_task: "+from_task );     
      switch (from_task) {
        
        case 'payment_partial':
        {
          Say = false;
          Remember.say_err_msg = `I'm sorry, I didn't quite get that. Please Say or enter the amount you want to pay. Example, you can say 50 dollars and 25 cents. or you can enter as 5 0 Asterisk 2 5 .`;
          Listen = false;
          Redirect = "task://payment_partial";
          //Tasks = ['payment_partial', 'agent_transfer'];
          break;
        }
        case 'greeting':
        Say = `I'm sorry, I didn't quite get that. Please Say again. `;
        Listen = false;
        Redirect = "task://greeting";
        //Tasks = [from_task, 'agent_transfer'];
        break;
      default:
        Say = `I'm sorry, I didn't quite get that. Please Say again.`;
        Listen = true;
        Tasks = [from_task, 'agent_transfer'];
        break;
      }
      
    }
  await RB.responseBuilder(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
  };
  