# Используем версию Node.js 18
FROM node:lts

# Установка рабочей директории внутри контейнера
WORKDIR /usr/app

RUN npm install --global pm2 yarn blitz --force
# COPY package.json yarn.lock ./
COPY . .
#COPY db/ ./db/
# Копирование зависимостей проекта
#COPY package*.json ./
RUN yarn install
#RUN yarn run blitz prisma migrate deploy
#RUN blitz db seed




# Установка зависимостей с помощью Yarn
# RUN yarn install --production=true
# RUN npm install

# Копирование всех файлов проекта
#COPY . .

# Установка переменной окружения NODE_ENV
ENV NODE_ENV=production

# Сборка проекта
RUN yarn build

# Открытие порта 3000 для доступа к приложению
EXPOSE 3000

# Команда для запуска приложения
CMD [ "yarn run blitz prisma migrate deploy", "yarn start --port 3000" ]

