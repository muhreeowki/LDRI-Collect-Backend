FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY eslint.config.mjs ./
COPY prisma ./prisma
COPY src ./src

RUN npm ci
RUN npx prisma generate

RUN npm run build

ENV NODE_ENV=production
ENV PORT=3001
EXPOSE 3001

CMD ["node", "dist/main.js"]


