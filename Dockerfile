FROM node as builder
WORKDIR /app-source
RUN npm install --save-dev node-sass
COPY package*.json ./
RUN npm install
COPY public ./public
RUN curl -o ./public/img/charlie-avatar.png http://raspberrypi:15000/entries/kids-morning-avatar-charlie
RUN curl -o ./public/img/clara-avatar.png http://raspberrypi:15000/entries/kids-morning-avatar-clara
COPY src ./src
RUN npm run build

FROM nginx:alpine
RUN mkdir /kids-morning-paper-app
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app-source/build /kids-morning-paper-app/