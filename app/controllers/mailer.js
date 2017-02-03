// using SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const helper = require('sendgrid').mail;
const sg = require('sendgrid')('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');

exports.invite = (req, res) => {
  const gameUrl = req.body.link;
  const inviteeEmail = req.body.email;
  const fromEmail = new helper.Email('game-invite@tsunade-cfh.com');
  const toEmail = new helper.Email(inviteeEmail);
  const subject = 'Tsunade Cards For Humanity Game Invitation ';
  const content = new helper.Content('text/plain', gameUrl);
  mail = new helper.Mail(fromEmail, subject, toEmail, content);

  const request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON()
  });

  sg.API(request, (error, response) => {
    res.send(response.statusCode);
  });
};

