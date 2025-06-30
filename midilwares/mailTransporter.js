import nodemailer from 'nodemailer'
const mailTransporter=nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:process.env.E_MAIL,
            pass:process.env.E_MAIL_PASS
        }
    })
    export default mailTransporter