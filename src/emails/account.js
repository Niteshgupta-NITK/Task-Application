const sgMail = require("@sendgrid/mail");
const sendgridAPIKey ='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';
sgMail.setApiKey(sendgridAPIKey);
sgMail
  .send({
    to: "guptanitesh400@gmail.com",
    from: "nitesh.kumar.gupta.nitk@gmail.com",
    subject: "FIrst",
    text: "Got first email from sendgrid",
  })
  .then(() => {
    console.log("was sent" );
  })
  .catch((e) => {
    console.log("email could not be sent" + e);
  });
