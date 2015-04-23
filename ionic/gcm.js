var gcm = require('node-gcm');

// Create a message
// ... with default values
var message = new gcm.Message();

// ... or some given values
var message = new gcm.Message({
    collapseKey: 'demo',
    delayWhileIdle: true,
    timeToLive: 3
});


// Set up the sender with you API key
var sender = new gcm.Sender('AIzaSyAsC2wnD51Lx_q-SIb2OS9f4sBam0EJrrM');

// Add the registration IDs of the devices you want to send to
var registrationIds = [];
registrationIds.push('APA91bGYhNmLxodYHaf0-F8hrbdhfrwka_uHdUGK0EJNImSmEKUlAHU711OjAj5nsX9mjr90Mkmi9v1J4vwkWJHS7_rEJm5GtyjwAVQMCH0VqJTgyst0i6_gJO361ttmwkkL6N5Y9uztw_l4gKtRhafxmMSCDhRg-Hotxr4jSgzv9wsdmlw2eY4');

// Send the message
// ... trying only once
sender.sendNoRetry(message, registrationIds, function(err, result) {
  if(err) console.error(err);
  else    console.log(result);
});

// // ... or retrying
// sender.send(message, registrationIds, function (err, result) {
//   if(err) console.error(err);
//   else    console.log(result);
// });

// // ... or retrying a specific number of times (10)
// sender.send(message, registrationIds, 10, function (err, result) {
//   if(err) console.error(err);
//   else    console.log(result);
// });