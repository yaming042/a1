const nodemailer = require("nodemailer");
const config = require('./../config/config.json')

const Mailer = async (params) => {
    let transporter = nodemailer.createTransport({
        service: 'smpt.163.com',
        host: 'smtp.163.com',
        secureConnection: true,
        port: 465,
        auth: {
            user: config.mailer.user, // generated ethereal user
            pass: config.mailer.pass, // generated ethereal password
        }
    });

    let {to='', subject='default', content=''} = params;
    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: config.mailer.from, // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        // text: "Hello world?", // plain text body
        html: content, // html body
    });

    return info.messageId;
};

module.exports = Mailer;