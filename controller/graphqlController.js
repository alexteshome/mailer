const graphqlHTTP = require("express-graphql");
const { buildSchema } = require("graphql");
const schemaJoi = require("../validation");
const nodemailer = require("nodemailer");

const schema = buildSchema(`
  type Query {
    message: String!,
  }
  type Mutation {
      sendEmail(  
        service: String!, 
        user: String!, 
        password: String!, 
        name: String!, 
        email: String!,
        message: String!
      ): Response
  }
  input EmailInput {
    service: String!, 
    user: String!, 
    password: String!, 
    name: String!, 
    email: String!, 
    message: String!
  }
  type Response {
    message: String!
  }
`);

const sendMail = async input => {
  const service = input.service;
  const user = input.user;
  const password = input.password;
  const name = input.name;
  const email = input.email;
  const message = input.message;
  const content = `Name: ${name} \n\n Email: ${email} \n\n Message: \n\n ${message} `;

  const result = schemaJoi.validate({ name, email, message });

  if (result.error) {
    console.log(result);
    return { message: result.error.details[0].message };
  }

  let transporter = nodemailer.createTransport({
    service: service,
    tls: true,
    auth: {
      user: user, // generated ethereal user
      pass: password // generated ethereal password
    }
  });

  transporter.verify((error, success) => {
    if (error) {
      console.log(error);
      return {
        message: error
      };
    }
  });
  const mail = {
    from: email,
    to: "chikamailer@gmail.com", //Change to email address that you want to receive messages on
    subject: "New message from Chika Mba Consulting Inc contact form",
    text: content
  };

  return transporter
    .sendMail(mail)
    .then(res => {
      console.log(res);
      return { message: "success" };
    })
    .catch(err => {
      console.log(err);
      return { message: "fail" };
    });
};

const root = {
  message: () => "GraphQL request successful!",
  sendEmail: graphqlInput => {
    return sendMail(graphqlInput);
  }
};

const graphql = graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true
});

module.exports = graphql;
