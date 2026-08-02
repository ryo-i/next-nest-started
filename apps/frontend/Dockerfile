FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

# 本番ではビルドを実行
# RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "dev"]
# 本番用のコマンド
# CMD ["npm", "start"]