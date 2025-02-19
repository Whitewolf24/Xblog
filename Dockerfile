# Use the slim Node.js 23.7.0 image as the base
FROM node:23.7.0-slim as base

# Set the working directory inside the container
WORKDIR /var/www

# Copy the package.json and package-lock.json (if exists)
COPY package*.json ./

# Install dependencies from package.json (including nodemailer if it’s listed)
RUN npm install

RUN npm install nodemailer

# Copy your application files into the container
COPY . .

# Build CSS assets (optional, if you’re using PostCSS, Tailwind, etc.)
RUN npm run css

# Expose the port the app will run on
EXPOSE 3000

# Set the default command to run your app
CMD ["node", "server.js"]
