const SubscriptionPlans = require("../models/SubscriptionPlansModel")
const Order = require("../models/OrderModel")
const SubscriptionPlan = require("../models/SubscriptionPlansModel")
const crypto = require('crypto');
require("dotenv").config()

/**
 * Generates PayHere payment hash
 * @param {string} merchantId - PayHere merchant ID
 * @param {string} orderId - Unique order ID
 * @param {number} amount - Payment amount
 * @param {string} currency - Currency code (LKR/USD)
 * @param {string} merchantSecret - Merchant secret key
 * @returns {string} Generated hash value
 */
function generatePayHereHash(merchantId, orderId, amount, currency, merchantSecret) {
    console.log("hash params : ", merchantId, orderId, amount, currency, merchantSecret)
  // Format amount to 2 decimal places
  const formattedAmount = Number(amount).toFixed(2);
  
  // Calculate MD5 hash of merchant secret and convert to uppercase
  const innerHash = crypto.createHash('md5')
                         .update(merchantSecret)
                         .digest('hex')
                         .toUpperCase();
  
  // Concatenate all parameters
  const hashString = [merchantId, orderId, formattedAmount, currency, innerHash].join("")
  
  // Calculate final MD5 hash and convert to uppercase
  return crypto.createHash('md5')
              .update(hashString)
              .digest('hex')
              .toUpperCase();
}

function generatePayHereVPHash(merchantId, orderId, amount, currency, status, merchantSecret) {
    console.log("hash params : ", merchantId, orderId, amount, currency, merchantSecret)
  // Format amount to 2 decimal places
  const formattedAmount = Number(amount).toFixed(2);
  
  // Calculate MD5 hash of merchant secret and convert to uppercase
  const innerHash = crypto.createHash('md5')
                         .update(merchantSecret)
                         .digest('hex')
                         .toUpperCase();
  
  // Concatenate all parameters
  const hashString = [merchantId, orderId, formattedAmount, currency, status, innerHash].join("")
  
  // Calculate final MD5 hash and convert to uppercase
  return crypto.createHash('md5')
              .update(hashString)
              .digest('hex')
              .toUpperCase();
}

// Example usage
// const merchantId = '1211144';
// const orderId = 'ORDER_12345';
// const amount = 1000.00;
// const currency = 'LKR';
// const merchantSecret = 'YOUR_MERCHANT_SECRET';
// const hash = generatePayHereHash(merchantId, orderId, amount, currency, merchantSecret);


async function getPlans(req, res){
    const plans = await SubscriptionPlans.find({})
    const plansObj = {}
    plans.forEach(plan=>{
        plansObj[plan.name] = plan
    })
    res.json(plansObj)
}

async function createOrder(req, res){
    const userId = req.user.userId
    const merchant_id = "1230134"
    const secret = process.env.merchant_secret
    const {planId, isMonthly} = req.body

    console.log("is monthly : ", isMonthly)
    const plan = await SubscriptionPlan.findById(planId)
    const price = isMonthly ? plan.monthlyPrice : plan.yearlyPrice
    const newOrder = await Order.createOrder(userId, plan.name, price, isMonthly ? "1 Month" : "1 Year")
    const hash = generatePayHereHash(merchant_id, newOrder._id.toString(), price, "LKR", secret)

    console.log("hash : ", hash)

    res.json({hash, order: newOrder})
}

async function paymentNotification(req, res){
    const {
        merchant_id ,
        order_id ,
        payment_id,
        subscription_id,
        payhere_amount,
        payhere_currency,
        status_code,
        md5sig,
        method ,
        status_message,
        recurring,
        message_type,
        item_recurrence,
        item_duration,
        item_rec_status,
        item_rec_date_next,
        item_rec_install_paid,
        card_holder_name,
        card_no,
        card_expiry
    } = req.body

    const secret = process.env.merchant_secret
    const hash = generatePayHereVPHash(merchant_id, order_id, payhere_amount, payhere_currency, status_code, secret)
    if(hash === md5sig){
        const order = await Order.findById(order_id)
        if(
            status_code === 2 &&
            payhere_amount >= order.price &&
            item_recurrence === order.recurrence
        ){

        }
    }else{
        // res.status(401).json({error: "Invalid payment"})
    }
}

module.exports = {
    getPlans,
    createOrder
}