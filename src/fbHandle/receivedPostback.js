let chatbot = require('./chatbot');

module.exports = {
  receivedPostback: async (event, app) => {
    var senderID = event.sender.id;
		var recipientID = event.recipient.id;
		var timeOfMessage = event.timestamp;
		var { payload, title } = event.postback;  
    var preProcessData = payload.split("-");
    let head = preProcessData[0]
    let tail = preProcessData[1]
    switch (head) {
      case "#sanpham": 
        await chatbot.showProducts(senderID, tail);
        break;
    }

  }
}