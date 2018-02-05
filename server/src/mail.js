const mailer = require('pug-mailer')
const dynamix = require('./dynamix')

mailer.init({
  service: 'gmail',
  auth: {
    user: dynamix.email,
    pass: dynamix.password
  }
})

exports.mail = async (customer, data) => {
  try {
    await mailer.send({
      from: dynamix.email,
      to: customer,
      subject: 'Your Coco D\'Nuts order',
      template: 'customer',
      data: data
    })
  } catch (error){console.error('Customer Mail Error', error)}
  try {
    await mailer.send({
      from: dynamix.email,
      to: dynamix.chef,
      subject: 'New Order!',
      template: 'chef',
      data: data
    })
  } catch (error){console.error('Chef Mail Error', error)}
}
