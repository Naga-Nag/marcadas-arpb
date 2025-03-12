# Use Bun base image
FROM oven/bun:latest

WORKDIR /app

# Copy dependency files first to leverage Docker caching
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install --frozen-lockfile

# Install required system dependencies for SQL Server
RUN apt-get update && apt-get install -y \
    unixodbc \
    unixodbc-dev \
    odbcinst \
    libodbc1 \
    curl && \
    rm -rf /var/lib/apt/lists/*

# Copy the rest of the project
COPY . .

# Build the SvelteKit project
RUN bun run build

# Expose the app port (3000 for SvelteKit)
EXPOSE 3000

# Start the app
CMD ["bun", "run", "start"]
