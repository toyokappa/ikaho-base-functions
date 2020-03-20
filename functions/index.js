const functions = require('firebase-functions');
const mailgun = require('mailgun-js')
const apiKey = functions.config().mail.apiKey
const domain = functions.config().mail.domain
const mailTo = functions.config().mail.to

const mg = mailgun({ apiKey, domain })

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
    await mg.messages().send(mail)
  } catch (e) {
    console.error(`send faild: ${e}`)
    throw new functions.https.HttpsError('internal', `send faild: ${e}`)
  }
})