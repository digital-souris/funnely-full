const dotenv = require('dotenv')

dotenv.config()

module.exports = {
    apps: [
        {
            name: 'parser',
            script: './parser/app.js',
            watch: process.env.NODE_ENV !== 'production',
            env: {
                PORT: 3001,
            },
            "exec_mode": "cluster",
            instances: 'max',
            "cron_restart": "30 * * * * *",
            out_file: "/dev/null",
            error_file: "/dev/null"
        }
    ],

    deploy: {
        production: {
            user: 'SSH_USERNAME',
            host: 'SSH_HOSTMACHINE',
            ref: 'origin/master',
            repo: 'GIT_REPOSITORY',
            path: 'DESTINATION_PATH',
            'pre-deploy-local': '',
            'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
            'pre-setup': ''
        }
    }
};
