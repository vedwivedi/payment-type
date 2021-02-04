// This is your new function. To start, set the name and path on the left.

exports.yes_no = async function (context, event, callback) {
  try {
    let Say;
    let Prompt = '';
    let Tasks = false;
    let Remember = {};
    let Redirect = false;
    let Listen = false;
    let Collect = false;
    let Handoff = false;

    const Memory = JSON.parse(event.Memory);

    Remember.task_fail_counter = 0;
    Remember.repeat = false;
    console.log("custom_yes_no: " + event.Field_custom_yes_no_Value);
    console.log("yes_no: " + event.Field_yes_no_Value);
    console.log("Memory.question: " + Memory.question);

    switch (Memory.question) {
      case 'payment_full':
        if (event.Field_yes_no_Value === 'Yes' || event.Field_custom_yes_no_Value === '1') {
          //Say = `Your payment amount is $${Memory.payment_amount}. Do you want to change the amount.`;
          Listen = false;
          Redirect = "task://payment_full";
          break;

        }
        else if (event.Field_yes_no_Value === 'No' || event.Field_custom_yes_no_Value === '2') {
          Redirect = 'task://partial_yes_no';
          break;

        } else {
          Say = false;
          Redirect = 'task://fallback';

          break;
        }
      case 'payment_partial':
        if (event.Field_yes_no_Value === 'Yes' || event.Field_custom_yes_no_Value === '1') {
          Redirect = 'task://payment_partial';
          break;

        } else if (event.Field_yes_no_Value === 'No' || event.Field_custom_yes_no_Value === '2') {
          Redirect = "task://arrangement_yes_no";
          break;

        } else {
          Say = false;
          Redirect = 'task://fallback';

          break;
        }
      case 'payment_arrangement':
        if (event.Field_yes_no_Value === 'Yes' || event.Field_custom_yes_no_Value === '1') {
          Redirect = "task://payment_arrangement";
          break;

        } else if (event.Field_yes_no_Value === 'No' || event.Field_custom_yes_no_Value === '2') {
          Say = false;
          Redirect = 'task://agent_transfer';
          Remember.question = "";
          Remember.payment_type = '4';
          break;

        } else {
          Say = false;
          Redirect = 'task://fallback1';

          break;
        }
      case 'payment_amount_check':
        if (event.Field_yes_no_Value === 'Yes') {
          Listen = false;
          Remember.say_err_msg = "Okay! Please Say or enter the amount you want to pay. Example, you can say 50 dollars and 25 cents. or you can enter as 5 0 Asterisk 2 5 .";
          Redirect = "task://payment_partial";
          break;

        } else if (event.Field_yes_no_Value === 'No') {
          Say = false;
          //Redirect = 'task://agent_transfer';
          break;

        } else {
          Say = false;
          Redirect = 'task://fallback';

          break;
        }
      case 'agent_transfer':
        if (event.Field_yes_no_Value === 'Yes') {

          Say = false;
          Redirect = 'task://agent_transfer';

          break;

        } else if (event.Field_yes_no_Value === 'No') {

          Say = false;
          Redirect = 'task://goodbye';

          break;

        } else {
          Say = false;
          Redirect = 'task://fallback';

          break;
        }


      default:
        Say = false;
        Redirect = 'task://fallback';

        break;
    }

    //End of your code.

    // This callback is what is returned in response to this function being invoked.
    const functions = Runtime.getFunctions();
    let path = functions['responseBuilder'].path;
    let RB = require(path);
    await RB.responseBuilder(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);

  } catch (error) {
    console.error(error);
    callback(error);
  }
};
