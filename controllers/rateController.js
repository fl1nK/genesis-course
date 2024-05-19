const axios = require('axios');

const getRate = async (req, res) => {
    try {

        const rate = getCurrentRate()
        res.status(200).json({ rate });
    } catch (error) {
        console.error('Error fetching exchange rate:', error);
        res.status(400).json({ error: 'Invalid status value' });
    }
};

// Функція для отримання поточного курсу валют
const getCurrentRate = async () => {
    try {
        const apiKey = process.env.OPEN_EXCHANGE_RATES_API_KEY;
        const apiUrl = `https://openexchangerates.org/api/latest.json?app_id=${apiKey}&symbols=UAH`;

        const response = await axios.get(apiUrl);
        return response.data.rates.UAH;
    } catch (error) {
        console.error('Error getting current rate:', error);
        throw new Error('Failed to get current rate');
    }
};

module.exports = {
    getRate,
    getCurrentRate,
};
