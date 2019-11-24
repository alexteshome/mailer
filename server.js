const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const app = express();
const cors = require("cors");
const schema = require("./validation");
const Joi = require("@hapi/joi");

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
  var content = `Name: ${name} \n\n Email: ${email} \n\n Message: \n\n ${message} `;

  const result = schema.validate({ name, email, message });

  if (result.error) {
    console.log(result);
    return res.status(400).json({ message: result.error.details[0].message });
  }

  let transporter = nodemailer.createTransport({
    service: creds.service,
    tls: true,
    auth: {
      user: creds.user,
      pass: creds.password
    }
  });

  transporter.verify((error, success) => {
    if (error) {
      console.log(error);
      return res.json({
        message: "fail"
      });
    }
  });
  var mail = {
    from: email,
    to: "info@cmbaconsulting.ca",
    subject: "New message from Chika Mba Consulting Inc contact form",
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
