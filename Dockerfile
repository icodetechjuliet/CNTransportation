# ---- Build stage --------------------------------------------------------
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
# --ignore-scripts: skip the "prepare" (husky) lifecycle script — there's no
# .git directory in this build context and git hooks are meaningless in a
# container anyway.
RUN npm ci --ignore-scripts

COPY . .
RUN npx quasar build

# ---- Serve stage ----------------------------------------------------------
FROM nginx:1.27-alpine
COPY --from=build /app/dist/spa /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
