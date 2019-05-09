var request = require('request');
var { PAGE_ACCESS_TOKEN } = require('../config/fbwebhook')
var mongoose = require('mongoose');
var _ = require('lodash')
module.exports = {
  getFullInfo: (messagingEvent, app) => {
    return new Promise(async (resolve, reject) => {
      request(
        "https://graph.facebook.com/v3.2/" +
          messagingEvent[0].sender.id +
          "?access_token=" +
          PAGE_ACCESS_TOKEN,
        async (error, response, body) => {
          if (!error && response.statusCode == 200) {
            let importedJSON = JSON.parse(body);
            messagingEvent[0].sender.first_name = importedJSON.first_name;
            messagingEvent[0].sender.last_name = importedJSON.last_name;
            messagingEvent[0].sender.fullname = importedJSON.first_name + " " + importedJSON.last_name;
            messagingEvent[0].sender.profile_picture = importedJSON.profile_pic;
            messagingEvent[0].sender.gender = importedJSON.gender; 
            let customer = await mongoose.model('customers').findOne({ facebookId: messagingEvent[0].sender.id })
            if (_.isEmpty(customer)) {
              await mongoose.model('customers').create({
                facebookId: messagingEvent[0].sender.id,
                fullName: messagingEvent[0].sender.fullname
              })
            }
            resolve(messagingEvent);
          } else {
            reject(error);
          }
        }
      );
    })
  },
  sendText: function (recipientId, text) {
    return new Promise(async (reslove, reject) => {
      var messageData = {
        recipient: {
          id: recipientId
        },
        message: {
          text
        }
      };
      request({
        uri: 'https://graph.facebook.com/v3.2/me/messages',
        qs: { access_token: PAGE_ACCESS_TOKEN },
        method: 'POST',
        json: messageData
      }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var recipientId = body.recipient_id;
          var messageId = body.message_id;
          reslove(true);
        } else {
          reject(response.statusCode)
        }
      });
    })
  },

  sendImage: function (recipientId, images) {
    return new Promise(async (reslove, reject) => {
      var messageData = {
        recipient: {
          id: recipientId
        },
        message: {
          attachment: {
            type: "image", 
            payload: {
              url: images,
              is_reusable: true
            }
          }
        }
      };
      request({
        uri: 'https://graph.facebook.com/v3.2/me/messages',
        qs: { access_token: PAGE_ACCESS_TOKEN },
        method: 'POST',
        json: messageData
      }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var recipientId = body.recipient_id;
          var messageId = body.message_id;
          reslove(true);
        } else {
          reject(response.statusCode)
        }
      });
    })
  },

  sendListInfo: (recipientId, elements, buttons = null, cover = false) => {
    return new Promise(async (reslove, reject) => {
      console.log(elements)
      var messageData = {
        recipient: {
          id: recipientId
        },
        message: {
          attachment: {
            type: "template", 
            payload: {
              template_type: "list",
              top_element_style: cover ? "large" :"compact",
              elements,
              buttons
            }
          }
        }
      };
      request({
        uri: 'https://graph.facebook.com/v3.2/me/messages',
        qs: { access_token: PAGE_ACCESS_TOKEN },
        method: 'POST',
        json: messageData
      }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var recipientId = body.recipient_id;
          var messageId = body.message_id;
          reslove(true);
        } else {
          reject(response)
        }
      });
    })
  },

  sendButton: (recipientId, text, buttons) => {
    return new Promise(async (reslove, reject) => {
      var messageData = {
        recipient: {
          id: recipientId
        },
        message: {
          attachment: {
            type: "template",
            payload: {
              template_type: "button",
              text: text,
              buttons: [
                ...buttons
              ]
            }
          }
        }
      };
      request({
        uri: 'https://graph.facebook.com/v3.2/me/messages',
        qs: { access_token: PAGE_ACCESS_TOKEN },
        method: 'POST',
        json: messageData
      }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var recipientId = body.recipient_id;
          var messageId = body.message_id;
          reslove(true);
        } else {
          reject(response.statusCode)
        }
      });
    })
  },

  sendQuickReplies: (recipientId, text, button) => {
    return new Promise(async (reslove, reject) => {
      var messageData = {
        recipient: {
          id: recipientId
        },
        message:{
          text: text,
          "quick_replies": button
        }
      };
      request({
        uri: 'https://graph.facebook.com/v3.2/me/messages',
        qs: { access_token: PAGE_ACCESS_TOKEN },
        method: 'POST',
        json: messageData
      }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var recipientId = body.recipient_id;
          var messageId = body.message_id;
          reslove(true);
        } else {
          reject(response.statusCode)
        }
      });
    })
  },
  sendBill: (recipientId, data, elements) => {
    return new Promise(async (reslove, reject) => {
      var messageData = {
        recipient: {
          id: recipientId
        },
        message: {
          "attachment":{
            "type":"template",
            "payload":{
              "template_type":"receipt",
              "recipient_name": data.recipient_name,
              "order_number": data._id,
              "currency": "VND",
              "payment_method": "cash",        
              // "order_url":"http://petersapparel.parseapp.com/order?order_id=123456",
              // "timestamp": new Date().getTime(),         
              "address":{
                "street_1": data.location,
                "city": "HCM",
                "postal_code":"70000",
                "state": "Hồ Chí Minh City",
                "country":"VN"
              },
              "summary":{
                "subtotal": data.cost,
                "shipping_cost": 0,
                "total_tax": 0,
                "total_cost": data.cost
              },
              elements,
              // "elements":[
              //   {
              //     "title":"Classic White T-Shirt",
              //     "subtitle":"100% Soft and Luxurious Cotton",
              //     "quantity":2,
              //     "price":50,
              //     "currency":"USD",
              //     "image_url":"http://petersapparel.parseapp.com/img/whiteshirt.png"
              //   },
              //   {
              //     "title":"Classic Gray T-Shirt",
              //     "subtitle":"100% Soft and Luxurious Cotton",
              //     "quantity":1,
              //     "price":25,
              //     "currency":"USD",
              //     "image_url":"http://petersapparel.parseapp.com/img/grayshirt.png"
              //   }
              // ]
            }
          }
        }
      };
      request({
        uri: 'https://graph.facebook.com/v3.2/me/messages',
        qs: { access_token: PAGE_ACCESS_TOKEN },
        method: 'POST',
        json: messageData
      }, function (error, response, body) {
        console.log(response)
        if (!error && response.statusCode == 200) {
          var recipientId = body.recipient_id;
          var messageId = body.message_id;
          reslove(true);
        } else {
          reject(response.statusCode)
        }
      });
    })
  }
};
