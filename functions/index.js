const functions = require('firebase-functions');
const nodemailer = require('nodemailer')
const mailUserName = functions.config().mail.username
const mailPassword = functions.config().mail.password
const mailTo = functions.config().mail.to

const mailTransport = nodemailer.createTransport({
  host: 'smpt.mailgun.org',
  port: 587,
  requiresAuth: true,
  auth: {
    user: mailUserName,
    pass: mailPassword
  }
})

const mailTemplate = (data) => {
  return `以下の内容でホームページよりお問い合わせがありました。

【お名前】 ${data.name}
【連絡先】 ${data.email}
【内容】
 ${data.message} 
  `
}

exports.sendMail = functions.https.onCall(async (data, _context) => {
  const mail = {
    from: 'test@ikahobase.jp',
    to: mailTo,
    subject: '【伊香保BASE】お問い合わせがありました',
    text: mailTemplate(data)
  }

  try {
    await mailTransport.sendMail(mail)
  } catch (e) {
    console.error(`send faild: ${e}`)
    throw new functions.https.HttpsError('internal', `send faild: ${e}`)
  }
})