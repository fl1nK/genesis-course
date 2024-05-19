// index.js
const express = require('express');
const rateController = require('./controllers/rateController');
const subscriptionController = require('./controllers/subscriptionController');
const { connectDB } = require('./config/db');
const cron = require('node-cron');
const Subscription = require("./models/Subscription");
const nodemailer = require('nodemailer');
const {getCurrentRate} = require("./controllers/rateController");

const app = express();
const PORT = process.env.PORT || 5000;

connectDB().then(r => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
})

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/rate', rateController.getRate);
app.post('/subscribe', subscriptionController.subscribe);

// Розпорядник завдань для відправлення електронних листів щоденно о певному часі
cron.schedule('00 00 * * *', async () => {
    try {
        // Отримайте списки підписаних користувачів з бази даних
        const subscribers = await Subscription.find();
        const currentRate = getCurrentRate();
        // Перевірте, чи пройшов досить часу для надсилання кожному користувачеві
        for (const subscriber of subscribers) {
            sendEmail(subscriber.email, 'Денний курс валюти', `Ось щоденний курс валюти USD в UAH: ${currentRate}`);

            subscriber.lastSent = new Date();
            await subscriber.save();
        }

        console.log("corn test")
    } catch (error) {
        console.error('Error sending daily emails:', error);
    }
}, {
    timezone: 'Europe/Kiev' // Встановіть часовий пояс за потребою
});

// Функція для надсилання електронних листів
const sendEmail = async (email, subject, message) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: '****@gmail.com',
                pass: '**********',
            },
        });

        const mailOptions = {
            from: '****@gmail.com',
            to: email,
            subject: subject,
            text: message,
        };

        await transporter.sendMail(mailOptions);

        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
};

module.exports = sendEmail;
