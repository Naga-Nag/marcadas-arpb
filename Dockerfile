FROM oven/bun

WORKDIR /app
COPY package.json package.json
RUN bun install

COPY . .
RUN bun run build

EXPOSE 80
ENTRYPOINT ["bun", "./build"]