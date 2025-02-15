# Use the official Bun image as the base image
FROM oven/bun:alpine as build

# Set working directory
WORKDIR /app

# Install required dependencies including Python, setuptools, and build tools
RUN apk add --no-cache python3 py3-setuptools make g++

# Ensure python points to python3
RUN ln -sf /usr/bin/python3 /usr/bin/python

# Copy the package.json, bun.lock (lockfile), and the rest of the application code
COPY package.json bun.lock ./
COPY . .

# Clean up temporary files and force bun install without cache
RUN rm -rf /tmp/* && bun install --no-cache

# Build the Next.js application for production
RUN bun next build

# We will use a second stage to keep the final image small
FROM oven/bun:alpine

# Set working directory
WORKDIR /app

# Copy the built Next.js files from the previous stage
COPY --from=build /app /app

# Expose the port that Railway will bind to (use the $PORT environment variable)
EXPOSE $PORT

# Start the Next.js server using Bun
CMD ["bun", "next", "start"]
