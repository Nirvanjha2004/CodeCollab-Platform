# Use a base image with necessary build tools
FROM gcc:latest

# Install build tools and necessary packages
RUN apt-get update && apt-get install -y build-essential

# Set the working directory
WORKDIR /app

# Copy the code into the container (assuming the code is dynamically provided)
COPY . /app

# Define default command
CMD ["bash"]
