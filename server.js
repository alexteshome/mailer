const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const app = express();
const cors = require("cors");

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json"
  );
  next();
});

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
