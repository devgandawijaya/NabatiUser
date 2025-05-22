# Gunakan base image
FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Salin file package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Salin semua file project ke dalam container
COPY . .

# Set environment variable jika diperlukan
ENV NODE_ENV=production

# Jalankan aplikasi
CMD ["node", "app.js"]

# Atau jika kamu pakai nodemon/dev (ubah sesuai kebutuhan)
# CMD ["npm", "run", "dev"]
