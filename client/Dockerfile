FROM node:18

WORKDIR /app

COPY package*.json ./
# RUN npm install --omit=optional
RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]