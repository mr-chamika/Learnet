const mongoose = require("mongoose");

const SubscriptionPlanSchema = new mongoose.Schema({
    name: {
        type: String,
        enum: ["SILVER", "GOLD", "PLATINUM"],
        required: true,
        unique: true
    },
    monthlyPrice: {
        type: Number,
        required: true,
        min: 0
    },
    yearlyPrice: {
        type: Number,
        required: true,
        min: 0
    },
    features: [{
        type: String
    }],
    createdOn: {
        type: Date,
        default: Date.now
    },
    updatedOn: {
        type: Date,
        default: Date.now
    }
});

SubscriptionPlanSchema.pre("save", function(next){
    this.updatedOn = Date.now()
    next()
})

SubscriptionPlanSchema.methods = {
    updateStatus: async function (status){
        this.status = status
        await this.save()
    }
}

SubscriptionPlanSchema.statics = {
    createOrder: async function (userId, plan) {
        const order = new this({userId, plan})
        await order.save()
        return order
    },
    deleteOrder: async function (orderId) {
        const deletedOrder = await this.deleteOne({ _id: orderId});
        return deletedOrder;
    },
};

const SubscriptionPlan = mongoose.model("SubscriptionPlan", SubscriptionPlanSchema);
module.exports = SubscriptionPlan