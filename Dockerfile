FROM node:22-alpine

WORKDIR /app

# Install dependencies first
COPY package.json package-lock.json ./
RUN npm install

# Copy your source code
COPY . .

# Expose the port Vite uses
EXPOSE 5173

# Start the application
CMD ["npm", "run", "dev", "--", "--host"]
