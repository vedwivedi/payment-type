// This is your new function. To start, set the name and path on the left.

exports.yes_no =async function(context, event, callback) {
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
  console.log("yes_no: "+event.Field_yes_no_Value);
  console.log("Memory.question: "+Memory.question);

  switch ( Memory.question ) {
    case 'payment_full':
      if (event.Field_yes_no_Value === 'Yes' || event.Field_custom_yes_no_Value === '1') {        
        //Say = `Your payment amount is $${Memory.payment_amount}. Do you want to change the amount.`;
        Listen=false;
        Redirect="task://collect_partial_Amount";
        break;

      } 
      else if (event.Field_yes_no_Value === 'No' || event.Field_custom_yes_no_Value === '2') {
        // Say = `Do you want to pay less than your full balance, say yes or No. you can also press 1 for yes and 2 for no.`;     
        // Remember.question="payment_partial";
        // Remember.payment_type = 'partial';
        // Listen = true;
        // Tasks=['payment_partial'];
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
        // Say = `Do you want to make a payment arrangement, say yes or No. you can also press 1 for yes and 2 for no.`;  
        // Listen = true;   
        // Remember.question="payment_arrangement";
        // Remember.payment_type = 'arrangement';  
        Redirect="task:arrangement_yes_no";     
        break;

      } else {
        Say = false;
        Redirect = 'task://fallback';

        break;
      }
    case 'payment_arrangement':        
        if (event.Field_yes_no_Value === 'Yes' || event.Field_custom_yes_no_Value === '1') {        
          // Say="You will be transfered to payment arrangement Bot"
          // Remember.payment_type = 'arrangement'; 
          Redirect="task://payment_arrangement" ;    
          break;
  
        } else if (event.Field_yes_no_Value === 'No' || event.Field_custom_yes_no_Value === '2') {
          Say = false;
          Redirect = 'task://agent_transfer';
          Remember.question="";
          Remember.payment_type = 'Nothing Select';       
          break;
  
        } else {
          Say = false;
          Redirect = 'task://fallback1';
  
          break;
        }  
    case 'payment_date_check':
    case 'payment_amount_check':
      if (event.Field_yes_no_Value === 'Yes') {
        //Say="you will be transfered to Payment Method Bot."
        Listen=false;
        Redirect="task://payment_partial";
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
    
    case 'split_balance':
      if (event.Field_yes_no_Value === 'Yes') {
        Say = `Are you able to make the first payment today, say yes or no.`;

        Remember.question = 'payment_today';
        Remember.split_payment = true;

        Listen = true;
        Tasks = ['yes_no', 'agent_transfer'];

        break;

      } else if (event.Field_yes_no_Value === 'No') {
        Collect = {
          "name": "collect_arrangement_details",
          "questions": [
            {
              "question": `How many payments are needed to make this affordable for you. We can set up an arrangement for a maximum of 6 payments to be payable weekly, bi-weekly or monthly.
                            How many payments do you want to make.`,
              "name": "no_of_payments",
              "type": "Twilio.NUMBER"
            },
            {
              "question": `Do you want to pay weekly, bi-weekly or monthly.`,
              "name": "payment_frequency",
              "type": "PAYMENT_FREQUENCY"
            },
          ],
          "on_complete": {
            "redirect": "task://arrangement_check"
          }
        };

        Say = false;
        Remember.split_payment = false;

        break;

      } else {
        Say = false;
        Redirect = 'task://fallback';

        break;
      }
    
    case 'payment_today':
      if (event.Field_yes_no_Value === 'Yes') {
        let current_date = new Date();
        let today_plus_30 = current_date;
        today_plus_30.setDate(current_date.getDate() + 30);
        today_plus_30 = current_date.toLocaleDateString('en-GB');
        
        if ( Memory.split_payment ) {
          Collect = {
            "name": "collect_second_date",
            "questions": [
              {
                "question": `Which date do you want to make the second payment, it has to be before <say-as interpret-as="date" format="dmy">${today_plus_30}</say-as>.`,
                "name": "second_date",
                "type": "Twilio.DATE"
              },
            ],
            "on_complete": {
              "redirect": "task://arrangement_payment"
            }
          };

          Remember.first_payment_date = current_date.toLocaleDateString('en-GB');

          Say = false;
        } else {
          Remember.start_payment_date = current_date.toLocaleDateString('en-GB');
        }

        break;

      } else if (event.Field_yes_no_Value === 'No') {
        let current_date = new Date();
        let today_plus_30 = current_date;
        today_plus_30.setDate(current_date.getDate() + 30);
        today_plus_30 = current_date.toLocaleDateString('en-GB');

        if ( Memory.split_payment ) {
          Collect = {
            "name": "collect_payment_dates",
            "questions": [
              {
                "question": `Please say the date you want to make the first payment, it has to be before <say-as interpret-as="date" format="dmy">${today_plus_30}</say-as>.`,
                "name": "first_date",
                "type": "Twilio.DATE"
              },
              {
                "question": `Which date do you want to make the second payment, it has to be before <say-as interpret-as="date" format="dmy">${today_plus_30}</say-as>.`,
                "name": "second_date",
                "type": "Twilio.DATE"
              },
            ],
            "on_complete": {
              "redirect": "task://arrangement_payment"
            }
          };
  
          Say = false;

        } else {
          Collect = {
            "name": "collect_start_date",
            "questions": [
              {
                "question": `Please say the date you want to make the first payment, it has to be before <say-as interpret-as="date" format="dmy">${today_plus_30}</say-as>.`,
                "name": "start_date",
                "type": "Twilio.DATE"
              }
            ],
            "on_complete": {
              "redirect": "task://arrangement_payment"
            }
          };
  
          Say = false;
        }

        break;

      } else {
        Say = false;
        Redirect = 'task://fallback';

        break;
      }
    

    case 'payment_setup_check':
      if (event.Field_yes_no_Value === 'Yes') {
        Say = `Are you able to make the first payment today, say yes or no.`;

        Remember.question = 'payment_today';
        Remember.split_payment = false;

        Listen = true;
        Tasks = ['yes_no', 'agent_transfer'];

        break;

      } else if (event.Field_yes_no_Value === 'No') {
        let current_date = new Date();
        let today_plus_30 = current_date;
        today_plus_30.setDate(current_date.getDate() + 30);
        today_plus_30 = current_date.toLocaleDateString('en-GB');
        
        Collect = {
          "name": "collect_arrangement_details",
          "questions": [
            {
              "question": `Alright, let's set up again. We can set up an arrangement for a maximum of 6 payments to be payable weekly, bi-weekly or monthly.
                            How many payments do you want to make.`,
              "name": "no_of_payments",
              "type": "Twilio.NUMBER"
            },
            {
              "question": `Do you want to pay weekly, bi-weekly or monthly.`,
              "name": "payment_frequency",
              "type": "PAYMENT_FREQUENCY"
            },
          ],
          "on_complete": {
            "redirect": "task://arrangement_check"
          }
        };

        Say = false;
        Remember.split_payment = false;

        break;

      } else {
        Say = false;
        Redirect = 'task://fallback';

        break;
      }

    case 'payment_amount_incorrect':
      if (event.Field_yes_no_Value === 'Yes') {
        if ( Memory.payment_type === 'partial' ) {
          Say = false;
          Listen=false;
          Redirect = 'task://payment_partial';
        }
        // } else if ( Memory.payment_type === 'arrangement' ) {
        //   Say = 'Alright. Please tell me the new payment amount and frequency.';

        //   Listen = true;
        //   Tasks = ['arrangement_payment'];
        // }

        break;

      } else if (event.Field_yes_no_Value === 'No') {
        Say = 'Alright. Do you want to be transfered to an agent?';

        Remember.question = 'agent_transfer';

        Listen = true;
        Tasks = ['yes_no'];

        break;

      } else {
        Say = false;
        Redirect = 'task://fallback';

        break;
      }


    case 'cc_check':
      if (event.Field_yes_no_Value === 'Yes') {
        Collect = {
          "name": "collect_exp_date",
          "questions": [
            {
              "question": `Alright. Tell me your card expiration date. The month and the year. Example, March 2026.`,
              "voice_digits": {
                "finish_on_key": "#"
              },
              "name": "cc_exp_date",
              "type": "Twilio.DATE"
            }
          ],
          "on_complete": {
            "redirect": "task://check_exp_date"
          }
        };
        Say = false;
        // Say = 'Alright. Tell me your card expiration date. The month and the year. Example, March 2026.';
        break;

      } else if (event.Field_yes_no_Value === 'No') {
        Collect = {
          "name": "collect_cc",
          "questions": [
            {
              "question": `Alright. Please say or use your telephone keypad to provide credit card number again.`,
              "voice_digits": {
                "finish_on_key": "#",
                "num_digits": 16
              },
              "name": "credit_card_num",
              "type": "Twilio.NUMBER_SEQUENCE"
            }
          ],
          "on_complete": {
            "redirect": "task://check_cc"
          }
        };
        Say = false;

        Remember.credit_card_num = '';

        break;

      } else {
        Say = false;
        Redirect = 'task://fallback';

        break;
      }

    case 'acceptable_cc':
      if (event.Field_yes_no_Value === 'Yes') {
        Collect = {
          "name": "collect_cc",
          "questions": [
            {
              "question": `Alright. Please say or use your telephone keypad to provide a new credit card number.`,
              "voice_digits": {
                "finish_on_key": "#",
                "num_digits": 16
              },
              "name": "credit_card_num",
              "type": "Twilio.NUMBER_SEQUENCE"
            }
          ],
          "on_complete": {
            "redirect": "task://check_cc"
          }
        };
        Say = false;

        break;

      } else if (event.Field_yes_no_Value === 'No') {
        Say = 'Alright. Do you want to be transfered to an agent?';

        Remember.question = 'agent_transfer';

        Listen = true;
        Tasks = ['yes_no'];

        break;

      } else {
        Say = false;
        Redirect = 'task://fallback';

        break;
      }


    case 'exp_date_check':
      if (event.Field_yes_no_Value === 'Yes') {
        Collect = {
          "name": "collect_digits",
          "questions": [
            {
              "question": `Alright. Tell me your CVV number located at the back of your card.`,
              "voice_digits": {
                "finish_on_key": "#"
              },
              "name": "digits",
              "type": "Twilio.NUMBER_SEQUENCE"
            }
          ],
          "on_complete": {
            "redirect": "task://digits_input"
          }
        };
        Say = false;
        // Say = 'Alright. Tell me your CVV number located at the back of your card.';
        Remember.digits_request_task = 'cvv';

        break;

      } else if (event.Field_yes_no_Value === 'No') {
        Collect = {
          "name": "collect_exp_date",
          "questions": [
            {
              "question": `Alright. Please tell me the expiration date again.`,
              "voice_digits": {
                "finish_on_key": "#"
              },
              "name": "cc_exp_date",
              "type": "Twilio.DATE"
            }
          ],
          "on_complete": {
            "redirect": "task://check_exp_date"
          }
        };
        Say = false;
        // Say = 'Alright. Please tell me the expiration date again.';
        Remember.credit_card_exp_date = '';

        break;

      } else {
        Say = false;
        Redirect = 'task://fallback';

        break;
      }

    case 'cvv_check':
      if (event.Field_yes_no_Value === 'Yes') {
        Say = false;

        Redirect = 'task://confirm_payment';

        break;

      } else if (event.Field_yes_no_Value === 'No') {
        Collect = {
          "name": "collect_digits",
          "questions": [
            {
              "question": `Alright. Please tell me the CVV again.`,
              "voice_digits": {
                "finish_on_key": "#"
              },
              "name": "digits",
              "type": "Twilio.NUMBER_SEQUENCE"
            }
          ],
          "on_complete": {
            "redirect": "task://digits_input"
          }
        };
        Say = false;
        // Say = 'Alright. Please tell me the CVV again.';

        Remember.credit_card_cvv = '';
        Remember.digits_request_task = 'cvv';

        break;

      } else {
        Say = false;
        Redirect = 'task://fallback';

        break;
      }

    case 'routing_check':
      if (event.Field_yes_no_Value === 'Yes') {
        Collect = {
          "name": "collect_bank_acc",
          "questions": [
            {
              "question": `Alright. Say or use your telephone keypad to provide your bank account number.`,
              "voice_digits": {
                "finish_on_key": "#"
              },
              "name": "bank_acc",
              "type": "Twilio.NUMBER_SEQUENCE"
            }
          ],
          "on_complete": {
            "redirect": "task://check_bank_acc_number"
          }
        };
        
        Say = false;
        // Say = 'Alright. Tell me your bank account number.';

        break;

      } else if (event.Field_yes_no_Value === 'No') {
        Collect = {
          "name": "collect_routing",
          "questions": [
            {
              "question": `Alright. Please tell me the routing number again.`,
              "voice_digits": {
                "finish_on_key": "#"
              },
              "name": "routing_num",
              "type": "Twilio.NUMBER_SEQUENCE"
            }
          ],
          "on_complete": {
            "redirect": "task://check_routing_number"
          }
        };
        Say = false;

        Remember.bank_acc_routing = '';

        break;

      } else {
        Say = false;
        Redirect = 'task://fallback';

        break;
      }

    case 'bank_acc_num_check':
      if (event.Field_yes_no_Value === 'Yes') {
        Say = 'Alright. Tell me your bank account type by saying "checking" for checking account "savings" for savings account.';

        Listen = true;
        Tasks = ['check_bank_acc_type'];

        break;

      } else if (event.Field_yes_no_Value === 'No') {
        Collect = {
          "name": "collect_bank_acc",
          "questions": [
            {
              "question": `Alright. Please tell me the bank account number again.`,
              "voice_digits": {
                "finish_on_key": "#"
              },
              "name": "bank_acc",
              "type": "Twilio.NUMBER_SEQUENCE"
            }
          ],
          "on_complete": {
            "redirect": "task://check_bank_acc_number"
          }
        };
        
        Say = false;
        // Say = 'Alright. Please tell me the bank account number again.';
        Remember.bank_acc_num = '';

        break;

      } else {
        Say = false;
        Redirect = 'task://fallback';

        break;
      }
      
    case 'bank_acc_type_check':
      if (event.Field_yes_no_Value === 'Yes') {
        Say = false;

        Redirect = 'task://confirm_payment';

        break;

      } else if (event.Field_yes_no_Value === 'No') {
        Say = 'Alright. Please tell me the bank account type again.';

        Remember.bank_acc_type = '';

        Listen = true;
        Tasks = ['check_bank_acc_type'];

        break;

      } else {
        Say = false;
        Redirect = 'task://fallback';

        break;
      }
    
    case 'confirm_payment':
      if (event.Field_yes_no_Value === 'Yes') {
        Say = `Alright. Let us process the payment.`;

        Redirect = 'task://payment_final_confirmation';

        break;

      } else if (event.Field_yes_no_Value === 'No') {
        Say = 'Alright. Do you want to be transfered to a representative?';

        Remember.question = 'agent_transfer';

        Listen = true;
        Tasks = ['yes_no'];

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

    case 'additional_help':
      if (event.Field_yes_no_Value === 'Yes') {

        Say = false;
        Listen = false;
        Redirect = 'task://agent_transfer';

        break;

      } else if (event.Field_yes_no_Value === 'No') {

        // Say = 'Thanks for calling. Good bye.';
        Say = false;
        Listen = false;
        Redirect = 'task://goodbye';

        break;
        
      } else {
        Say = false;
        Redirect = 'task://fallback';

        break;
      }
      
    default:
      Say = false;
      Redirect = 'task://fallback1';

      break;
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
