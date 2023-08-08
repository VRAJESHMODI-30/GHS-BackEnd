const express = require("express");
require('dotenv').config();
const nodemailer = require("nodemailer");
const cors = require("cors");
const port = process.env.PORT;
const app = express();
app.use(cors());
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb" }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

function sendEnquiry({
  first,
  last,
  companyName,
  contact,
  companyAddress,
  email,
  subject,
  question,
}) {
  return new Promise((resolve, reject) => {
    var transporter = nodemailer.createTransport({
      host: "smtp-relay.sendinblue.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_API_ID,
        pass: process.env.SMTP_API_KEY,
        // user: myemail,
        // pass: password,
      },
    });

    const mail_configs = {
      from: email,
      to: process.env.SMTP_API_ID,
      // to: myemail,
      subject: subject,
      html: `<h2>Hello GHS,</h2>
      <strong>Client Name : </strong>${first + ' ' + last}
      <br/>
      <strong>Company Name : </strong>${companyName}
      <br/>
      <strong>Contact Number : </strong>${contact}
      <br/>
      <strong>Address : </strong> ${companyAddress}
      <br/>
      <strong>Email : </strong> ${email}
      <br/>
      <strong>Enquiry : </strong> ${question}
      <br/>
      <h3>Regards,</h3>
      <p>${first + ' ' + last}</p>`
      // text: question,
    };

    transporter.sendMail(mail_configs, function (err, info) {
      if (err) {
        console.log(err);
        return reject({ message: "An error has occured" });
      }
      return resolve({ message: "Email sent succesfuly" });
    });
  });
}

function sendProductInquiry({
  subject,
  name,
  contact,
  email,
  question
}) {
  return new Promise((resolve, reject) => {
    var transporter = nodemailer.createTransport({
      host: "smtp-relay.sendinblue.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_API_ID,
        pass: process.env.SMTP_API_KEY,
        // user: myemail,
        // pass: password,
      },
    });

    const mail_configs = {
      from: email,
      to: process.env.SMTP_API_ID,
      // to: myemail,
      subject: subject,
      html: `<h2>Hello GHS,</h2>
      <p>This Inquiry is regarding <strong>${subject}</strong></p>
      <br/>
      <strong>Client Name : </strong>${name}
      <br/>
      <strong>Contact Number : </strong>${contact}
      <br/>
      <strong>Email : </strong> ${email}
      <br/>
      <strong>Enquiry : </strong> ${question}
      <br/>
      <h3>Regards,</h3>
      <p>${name}</p>`
    };

    transporter.sendMail(mail_configs, function (err, info) {
      if (err) {
        console.log(err);
        return reject({ message: "An error has occured" });
      }
      return resolve({ message: "Email sent succesfuly" });
    });
  });
}

app.get("/api", (req, res) => {
  res.status(200).send("GHS API is LIVE!");
});

app.post("/api/send_enquiry", (req, res) => {
  sendEnquiry(req.body)
    .then((response) => res.status(200).send(response.message))
    .catch((error) => res.status(500).send(error.message));
});

app.post("/api/send_product_inquiry", (req, res) => {
  sendProductInquiry(req.body)
    .then((response) => res.status(200).send(response.message))
    .catch((error) => res.status(500).send(error.message));
});

app.listen(port, () => {
  console.log(`Backend app server is running on http://127.0.0.1:${port}`);
  console.log(typeof(process.env.SMTP_API_ID));
  console.log(process.env.SMTP_API_KEY);
});


// var myemail = "vrajeshmodi99@gmail.com";
// var password = "9IydjZK0banrwDBP";
