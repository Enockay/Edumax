# Use the official Node.js image as the base image
FROM node:18

# Install dependencies
RUN apt-get update && apt-get install -y \
  wget \
  gnupg \
  --no-install-recommends

# Install Google Chrome
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - && \
  sh -c 'echo "deb [arch=amd64] https://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
  apt-get update && \
  apt-get install -y google-chrome-stable --no-install-recommends && \
  rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy application files
COPY . .

# Install Node.js dependencies with legacy-peer-deps flag
RUN npm install --legacy-peer-deps

# Copy the entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose the port your app runs on
EXPOSE 3000

# Run the entrypoint script
CMD ["/entrypoint.sh"]
