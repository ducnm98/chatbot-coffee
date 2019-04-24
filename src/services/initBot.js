/* ********** SIMPLE DEMO **************
const http = require('http');
const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
   res.statusCode = 200;
   res.setHeader('Content-Type', 'text/plain');
   res.end('Hello Yafuo\n');
});

server.listen(port, hostname, ()=> {
   console.log(`Visit at http://${hostname}:${port}/`);
});
*********************************************/
// var logger = require('morgan');
// const http = require('http');
// const hostname = '127.0.0.1';
// const port = 3000;
//
// const server = http.createServer((req, res) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     res.end('Hello Yafuo\n');
// });
//
// server.listen(port, hostname, ()=> {
//     console.log(`Visit at http://${hostname}:${port}/`);
// });
// # SimpleServer
// A simple chat bot server

var logger = require('morgan');
var http = require('http');
var bodyParser = require('body-parser');
var express = require('express');
var router = express();

var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
var server = http.createServer(app);
var request = require("request");

app.get('/', (req, res) => {
    res.send("Home page. Server running okay.");
});

// Đây là đoạn code để tạo Webhook
app.get('/webhook', (req, res) => {
    let VERIFY_TOKEN = '123456789';
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];
    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
        }
    } else {
        res.sendStatus(403);
    }
});

// Xử lý khi có người nhắn tin cho bot
app.post('/webhook', (req, res) => {
    console.log('Webhook is called');
    let body = req.body;
    if (body.object === 'page') {
        body.entry.forEach(function (entry) {
           let webhook_event = entry.messaging[0];
           console.log(webhook_event);
           let sender_psid = webhook_event.sender.id;
           console.log(`Sender PSID: ${sender_psid}`);
           if (webhook_event.message) {
               console.log(webhook_event.message);
               sendMessage(sender_psid, `${webhook_event.message.text} nghĩa là gì ?`)
           } else if (webhook_event.postback) {
               console.log(webhook_event.postback);
           }
        });
        res.status(200).send('EVENT_RECEIVED');
    } else {
        res.sendStatus(404);
    }
    // var entries = req.body.entry;
    // for (var entry of entries) {
    //     var messaging = entry.messaging;
    //     for (var message of messaging) {
    //         var senderId = message.sender.id;
    //         if (message.message) {
    //             // If user send text
    //             if (message.message.text) {
    //                 var text = message.message.text;
    //                 console.log(text); // In tin nhắn người dùng
    //                 sendMessage(senderId, "Tui là bot đây: " + text);
    //             }
    //         }
    //     }
    // }
});


// Gửi thông tin tới REST API để trả lời
function sendMessage(senderId, message) {
    request({
        url: 'https://graph.facebook.com/v3.2/me/messages',
        qs: {
            access_token: "EAALTT3VQ8QUBAFfFtj5TYmVZBkGZAvCJwrYpqFcXvSZBSG7w1FB3nW7vICHma9mednlWE9k2oPXBbPoc9CgBBIwBVMOLzxUrDsw87jk4brOFeeZBYlFgivZA6Co4rljFSqZBYDZCqFXf2xsMlOZA0q4PIGj6FSEoZBmnTjx8EeGmwaAZDZD",
        },
        method: 'POST',
        json: {
            recipient: {
                id: senderId
            },
            message: {
                text: message
            },
        }
    });
}

app.set('port', process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3000);
app.set('ip', process.env.OPENSHIFT_NODEJS_IP || process.env.IP || "127.0.0.1");

server.listen(app.get('port'), app.get('ip'), function() {
    console.log("Chat bot server listening at %s:%d ", app.get('ip'), app.get('port'));
});
