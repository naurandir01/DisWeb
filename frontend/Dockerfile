FROM node:latest AS build

WORKDIR /build 
COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install --force

COPY . .

RUN npm run build


FROM nginx:stable-alpine
COPY --from=build /build/dist /usr/share/nginx/html

EXPOSE 8000
ENTRYPOINT ["nginx", "-g", "daemon off;"]