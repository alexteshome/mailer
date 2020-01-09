const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const app = express();
const cors = require("cors");
const schemaJoi = require("./validation");
const Joi = require("@hapi/joi");
const graphql = require("./controller/graphqlController");

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://cmbaconsulting.ca");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json"
  );
  next();
});

app.post("/send", (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const message = req.body.message;
  const content = `Name: ${name} \n\n Email: ${email} \n\n Message: \n\n ${message} `;

  const result = schemaJoi.validate({ name, email, message });

  if (result.error) {
    console.log(result);
    return res.status(400).json({ message: result.error.details[0].message });
  }

  let transporter = nodemailer.createTransport({
    service: "Gmail",
    tls: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  transporter.verify((error, success) => {
    if (error) {
      console.log(error);
      return res.json({
        message: error
      });
    }
  });
  const mail = {
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

app.use("/graphql", graphql);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
