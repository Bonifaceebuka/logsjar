module.exports = {
  apps: [
    {
      name: "logsjar-backend",
      env_file: ".env",
      script: "dist/server.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      max_restarts: 10,
      min_uptime: "10s",
    },
  ],
}; 
