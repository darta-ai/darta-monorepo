# Base Node Image
FROM node:14

# Set Working Directory
WORKDIR /app

# Copy root package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install pnpm and Project Dependencies
RUN npm install -g pnpm
RUN pnpm install

# Copy everything from the host machine to the image
COPY . .

# Expose the port your app will run on
EXPOSE 3000

# Set the default command to run your app
CMD [ "npm", "start" ]
