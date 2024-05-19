# Використовуйте базовий образ Node.js
FROM node:14

# Установіть робочий каталог в контейнері
WORKDIR /app

# Скопіюйте package.json та package-lock.json та встановіть залежності
COPY package*.json ./
RUN npm install

# Скопіюйте усі файли додатку в контейнер
COPY . .

# Відкрийте порт, на якому працює ваш сервер
EXPOSE 5000

# Команда для запуску сервера
CMD ["npm", "start"]
