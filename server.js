const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const sgMail = require("@sendgrid/mail");
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

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    from: email,
    to: "info@cmbaconsulting.ca",
    subject: name + " messaged you through Chika Mba Consulting Inc",
    text: content
  };

  sgMail
    .send(msg)
    .then(data => {
      console.log(data);
      res.json({
        message: "success"
      });
    })
    .catch(err => {
      console.log(err);
      res.json({
        message: "fail"
      });
    });
});

const PORT = process.env.PORT || 3001;
app.use(cors());

app.use("/graphql", graphql);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
