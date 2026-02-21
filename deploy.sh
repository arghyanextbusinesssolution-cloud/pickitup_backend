#!/bin/bash

# Configuration
EC2_USER="ec2-user"
EC2_IP="YOUR_EC2_PUBLIC_IP"
PEM_FILE="shipment-key.pem"
REMOTE_PATH="/home/ec2-user/uship-backend"

echo "Deploying to EC2..."

# 1. Sync files (excluding node_modules, .git, and dist)
rsync -avz -e "ssh -i $PEM_FILE" --exclude 'node_modules' --exclude '.git' --exclude 'dist' ./ $EC2_USER@$EC2_IP:$REMOTE_PATH

# 2. SSH into EC2 and restart
ssh -i $PEM_FILE $EC2_USER@$EC2_IP << EOF
    cd $REMOTE_PATH
    npm install
    npx prisma generate
    npm run build
    pm2 restart all || pm2 start dist/server.js --name "uship-backend"
EOF

echo "Deployment complete!"
