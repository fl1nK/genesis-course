// models/Subscription.js
const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    lastSent: {
        type: Date,
        default: Date.now,
    },
});

const Subscription = mongoose.model('Subscription', SubscriptionSchema);

module.exports = Subscription;
