const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const creds = require("./config");
const app = express();
const cors = require("cors");

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.post("/send", (req, res, next) => {
  var creds = req.body.creds;
  var name = req.body.name;
  var email = req.body.email;
  var message = req.body.message;
  var content = `name: ${name} \n email: ${email} \n message: ${message} `;

  let transporter = nodemailer.createTransport({
    service: creds.service,
    tls: true,
    auth: {
      user: creds.user, // generated ethereal user
      pass: creds.password // generated ethereal password
    }
  });

  transporter.verify((error, success) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take messages");
    }
  });
  var mail = {
    from: email,
    to: "chikamailer@gmail.com", //Change to email address that you want to receive messages on
    subject: "New Message from Contact Form",
    text: content
  };

  transporter.sendMail(mail, (err, data) => {
    if (err) {
      res.json({
        message: "fail"
      });
    } else {
      res.json({
        message: "success"
      });
    }
  });
});

const PORT = process.env.PORT || 3001;
app.use(cors());
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
