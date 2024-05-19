// controllers/subscriptionController.js
const Subscription = require('../models/Subscription');

const subscribe = async (req, res) => {
    try {
        const { email } = req.body;

        // Валідація електронної адреси
        if (!validateEmail(email)) {
            return res.status(400).json({ error: 'Недійсний формат електронної пошти' });
        }

        // Перевірка, чи вже існує підписка для вказаної адреси
        const existingSubscription = await Subscription.findOne({ email });

        if (existingSubscription) {
            return res.status(400).json({ error: 'Електронна пошта вже підписана' });
        }

        // Створення нової підписки
        const subscription = await Subscription.create({ email });

        res.status(201).json({ message: 'E-mail додано', subscription });
    } catch (error) {
        console.error('Помилка підписки на електронну адресу:', error);
        res.status(500).json({ error: 'Не вдалося підписатися' });
    }
};

// Функція для валідації електронної адреси
const validateEmail = (email) => {
    return /^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/.test(email);
};


module.exports = {
    subscribe,
};
