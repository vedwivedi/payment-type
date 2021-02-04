const functions = Runtime.getFunctions();
let greeting = require(functions['greeting'].path);
let payment_full = require(functions['payment_full'].path);
let payment_partial = require(functions['payment_partial'].path);
let payment_arrangement = require(functions['payment_arrangement'].path);
let partial_yes_no = require(functions['partial_yes_no'].path);
let arrangement_yes_no = require(functions['arrangement_yes_no'].path);
let payment_type = require(functions['payment_type'].path);
let collect_partial_Amount = require(functions['collect_partial_Amount'].path);
let responseBuilder = require(functions['responseBuilder'].path);
let yes_no = require(functions['yes_no'].path);
let agent_transfer = require(functions['agent_transfer'].path);
let fallback = require(functions['fallback'].path);

exports.handler = async (context, event, callback) => {

  const { CurrentTask } = event;
  const { CurrentInput } = event;
  const { CurrentTaskConfidence } = event;
  console.log("CurrentInput " + CurrentInput + ", CurrentTask: " + CurrentTask + ", CurrentTaskConfidence: " + CurrentTaskConfidence + "\n");

  // calling task handlers
  if (Number(CurrentTaskConfidence) === 1 || Number(CurrentTaskConfidence) === 0) {

    // calling task handlers
    switch (CurrentTask) {
      case 'greeting':
        {
          console.log("CurrentTask: " + CurrentTask);
          await greeting.greeting(context, event, callback);
          break;
        }
      case 'payment_full':
        {
          console.log("CurrentTask: " + CurrentTask);
          await payment_full.payment_full(context, event, callback);
          break;
        }
      case 'payment_partial':
        {
          console.log("CurrentTask: " + CurrentTask);
          await payment_partial.payment_partial(context, event, callback);
          break;
        }
      case 'payment_arrangement':
        {
          console.log("CurrentTask: " + CurrentTask);
          await payment_arrangement.payment_arrangement(context, event, callback);
          break;
        }
      case 'payment_type':
        {
          console.log("CurrentTask: " + CurrentTask);
          await payment_type.payment_type(context, event, callback);
          break;
        }
      case 'partial_yes_no':
        {
          console.log("CurrentTask: " + CurrentTask);
          await partial_yes_no.partial_yes_no(context, event, callback);
          break;
        }
      case 'arrangement_yes_no':
        {
          console.log("CurrentTask: " + CurrentTask);
          await arrangement_yes_no.arrangement_yes_no(context, event, callback);
          break;
        }
      case 'collect_partial_Amount':
        {
          console.log("CurrentTask: " + CurrentTask);
          await collect_partial_Amount.collect_partial_Amount(context, event, callback);
          break;
        }
      case 'yes_no':
        {
          console.log("CurrentTask: " + CurrentTask);
          await yes_no.yes_no(context, event, callback);
          break;
        }
      case 'agent_transfer':
        {
          console.log("CurrentTask: " + CurrentTask);
          await agent_transfer.agent_transfer(context, event, callback);
          break;
        }

      default:
        console.log("CurrentTask: " + CurrentTask);
        await fallback.fallback(context, event, callback);
        break;
    }
  }
  else {
    console.log("Fallback_CurrentTask: " + CurrentTask);
    await fallback.fallback(context, event, callback);
  }
};