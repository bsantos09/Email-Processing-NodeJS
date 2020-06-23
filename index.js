require('dotenv').config();
var imaps = require('imap-simple');
const simpleParser = require('mailparser').simpleParser;
const _ = require('lodash');

// trust all certificates
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

var config = {
  imap: {
    user: process.env.USEREMAIL,
    password: process.env.PASSWORD,
    host: process.env.IMAPSERVER,
    port: process.env.IMAPPORT,
    tls: true,
    authTimeout: 3000,
  },
};

imaps.connect(config).then(function (connection) {
  return connection.openBox('INBOX').then(function () {
    var searchCriteria = ['UNSEEN'];
    var fetchOptions = {
      bodies: ['HEADER', 'TEXT', ''],
    };
    return connection
      .search(searchCriteria, fetchOptions)
      .then(function (messages) {
        messages.forEach(function (item) {
          var all = _.find(item.parts, { which: '' });
          var id = item.attributes.uid;
          var idHeader = 'Imap-Id: ' + id + '\r\n';
          simpleParser(idHeader + all.body, (err, mail) => {
            console.log(mail.subject);

            console.log(mail.text);
          });
        });
        return true;
      });
  });
});
