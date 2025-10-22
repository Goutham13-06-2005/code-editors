# ---- Base Node ----
# Use an official Node.js runtime as a parent image (choose a version, e.g., 20)
FROM node:20-slim AS base
WORKDIR /app

# ---- Dependencies ----
# First, copy only package.json files and install all dependencies
FROM base AS deps
# Copy server package files and install server dependencies
COPY code-editor-server/package*.json ./code-editor-server/
RUN npm install --prefix code-editor-server --omit=dev

# Copy client package files and install client dependencies
COPY code-editor-client/package*.json ./code-editor-client/
RUN npm install --prefix code-editor-client --omit=dev

# ---- Build Client ----
# Copy the client source code and build it
FROM deps AS client-builder
COPY code-editor-client/ ./code-editor-client/
# Ensure build command uses relative paths if needed, or adjust WORKDIR
RUN npm run build --prefix code-editor-client

# ---- Final Image ----
# Start fresh from the base image
FROM base AS runner
WORKDIR /app

# Copy necessary files from previous stages
# Copy server code and server node_modules
COPY --from=deps /app/code-editor-server ./code-editor-server
# Copy the built client application
COPY --from=client-builder /app/code-editor-client/build ./code-editor-server/public

# Change working directory to the server folder
WORKDIR /app/code-editor-server

# Expose the port the app runs on (Fly.io uses 8080 by default internally, but connects to your app's port)
EXPOSE 3001

# Define the command to run your app
CMD ["node", "index.js"]