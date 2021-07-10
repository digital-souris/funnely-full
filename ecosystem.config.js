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
            combine_logs: false,
            merge_logs: false
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
