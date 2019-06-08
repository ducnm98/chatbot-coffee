let chatbot = require('./chatbot');

module.exports = {
  receivedMessage: async (event) => {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfMessage = event.timestamp;
    var message = event.message;
    console.log(event.sender);
    console.log(message);

    var isEcho = message.is_echo;
    var messageId = message.mid;
    var appId = message.app_id;
    var metadata = message.metadata;

    // You may get a text or attachment but not both
    var messageText = message.text;
    var messageAttachments = message.attachments;
    var quickReply = message.quick_reply;
    console.log("messageText: ", messageText);
    if (isEcho) {
      console.log(
        "Received echo for message %s and app %d with metadata %s",
        messageId,
        appId,
        metadata
      );
      return;
    }

    if (quickReply) {
      var headerPayload = quickReply.payload.split("-");
      let head = headerPayload[0];
      let tail = headerPayload[1];
      console.log("head, tail", headerPayload);
      switch (head) {
        case "#approve":
          await chatbot.approveProduct(senderID, headerPayload[1], headerPayload[2]);
          break;
        case '#time':
          await chatbot.chooseTime(senderID, tail);
          break;
      }
      // do what after user tap quick reply.
    }

    if (messageText) {
      messageText = messageText.trim();
      let preProcessData = messageText.split(" ");
      var head = preProcessData[0];
      var tail = preProcessData[1];

      switch (head) {
        case "#diachi":
          await chatbot.saveLocation(senderID, messageText);
          break;
        case "#sdt":
          await chatbot.savePhone(senderID, messageText);
          break;
      }
    }
  },
};
