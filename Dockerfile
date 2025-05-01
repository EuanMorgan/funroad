# Use the official MongoDB image from the Docker Hub
FROM mongo:latest

# This is where you can add your custom settings, scripts, etc.
# COPY ./init-mongo.js /docker-entrypoint-initdb.d/

# Expose the default MongoDB port
EXPOSE 27017