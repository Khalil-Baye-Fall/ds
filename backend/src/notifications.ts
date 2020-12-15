import * as nodemailer from "nodemailer";
const emailSender = 'rotedir897@btsese.com';
const senderPassword = '13dd6460-3190-11eb-a9b2-a5a944372c61';
const emailProvider = 'DebugMail';

export function sendEmailNotification(email: string, childName: string){
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'duncan.reinger28@ethereal.email',
            pass: 'cQWyZfWqegGmsjDAEM'
        }
    });

    const message = `
    <h1>UWAGA! PARENT ALERT!</h1>
    <h3>Twoje dziecko ${childName} znajduje się poza wyznaczonym przez Ciebie miejscem!</h3>
    <br>
    Podejmij interwencję, sprawdź niezwłocznie obecną lokalizację dziecka na portalu rodzica.
    <br<br><h5>Zespół childCare</h5>`

    var mailOptions = {
        from: emailSender, // sender address
        to: email, // list of receivers
        subject: childName + ' jest poza wyznaczonym miejscem!', // Subject line
        // text: message //, // plaintext body
        html: message
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
        }else{
            console.log('Email sent: ' + info.response);
        };
    });
}