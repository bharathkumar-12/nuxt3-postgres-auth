# Define Node version
ARG NODE_VERSION=21.6.1

# Build Stage
FROM node:${NODE_VERSION}-slim AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json files to the working directory
COPY package.json package-lock.json /app/

# Install dependencies using npm
RUN npm install

# Copy the rest of the application files to the working directory
COPY . ./

# Build the application
RUN npm run build

# Production Stage
FROM node:${NODE_VERSION}-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the output from the build stage to the working directory
COPY --from=build /app/.output ./

# Define environment variables
ENV HOST=0.0.0.0
ENV NODE_ENV=production
ENV PORT=3000

# Expose the port the application will run on
EXPOSE 3000

# Start the application
CMD ["node", "server/index.mjs"]
