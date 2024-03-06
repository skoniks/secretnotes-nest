module.exports = {
  apps: [
    {
      name: 'secret',
      script: 'npm',
      args: 'run start:prod',
      autorestart: true,
    },
  ],
};
