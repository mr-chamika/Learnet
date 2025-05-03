const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: "User",
    },
    plan: {
        type: String,
        enum: ["SILVER", "GOLD", "PLATINUM"],
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    recurrence: {
        type: String,
        enum: ["1 Month", "1 Year"],
        required: true
    },
    status: {
        type: String,
        enum: ["ACTIVE", "CANCELED", "PENDING"],
        default: "PENDING"
    },
    createdOn: {
        type: Date,
        default: Date.now
    },
    updatedOn: {
        type: Date,
        default: Date.now
    }
});

OrderSchema.pre("save", function(next){
    this.updatedOn = Date.now()
    next()
})

OrderSchema.index({_id: 1, userId: 1}, {unique: true})

OrderSchema.methods = {
    updateStatus: async function (status){
        this.status = status
        await this.save()
    }
}

OrderSchema.statics = {
    createOrder: async function (userId, plan, price, recurrence) {
        const order = new this({userId, plan, price, recurrence})
        await order.save()
        return order
    },
    deleteOrder: async function (orderId) {
        const deletedOrder = await this.deleteOne({ _id: orderId});
        return deletedOrder;
    },
};

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order