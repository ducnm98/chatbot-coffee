// var {} = require
var { receivedMessage } = require('./receivedMessage')
var { receivedPostback } = require('./receivedPostback')
module.exports = {
  directMessage: (messagingEvent) => {
    if (messagingEvent.message) {
      receivedMessage(messagingEvent);
    } else if (messagingEvent.delivery) {
      // messageProcess.receivedDeliveryConfirmation(messagingEvent);
    } else if (messagingEvent.postback) {
      receivedPostback(messagingEvent)
      // messageProcess.receivedPostback(messagingEvent);
    } else if (messagingEvent.read) {
      // messageProcess.receivedMessageRead(messagingEvent);
    } else if (messagingEvent.account_linking) {
      // messageProcess.receivedAccountLink(messagingEvent);
    } else {
      console.log("Webhook received unknown messagingEvent: ", messagingEvent);
    }
  }
}