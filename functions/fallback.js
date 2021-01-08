
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
  if(Memory.task_fail_counter===undefined) // new line add
     Remember.task_fail_counter=1;
  else
    Remember.task_fail_counter = Memory.task_fail_counter + 1;
  
    if ( Memory.task_fail_counter > 2 ) {
      Say = false;
      Listen = false;
      Remember.task_fail_counter = 0;
      Redirect = 'task://agent_transfer';
    } else {
      Say = `I'm sorry, I didn't quite get that. Please say that again.`;
      Listen = true;
  
      if ( Memory.from_task ) {
        Tasks = [Memory.from_task, 'agent_transfer'];
      }
    }
  await RB.responseBuilder(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
  };
  