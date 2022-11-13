# PRODUCTION DOCKERFILE
FROM node:16-alpine as dev
#
WORKDIR /task-10
# Dep
COPY package*.json ./
RUN npm install
# Build
COPY . .
RUN npm run build
# App
FROM node:16-alpine as app
COPY --from=dev /task-10/package*.json ./
RUN npm install --only=production && npm cache clean --force
RUN npm install pm2 -g
COPY --from=dev /task-9/dist ./dist
#
USER node
ENV PORT=4000
EXPOSE 4000
#
CMD ["node", "dist/main.js"]