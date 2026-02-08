# AWS Deployment Guide for SPORTIKON Arena

## Overview
This guide helps you deploy your Next.js application to AWS using an **AWS Learner Lab** account with **EC2** (free tier eligible) and **Supabase** for the database.

---

## Prerequisites
- AWS Learner Lab account (must be active)
- Supabase account with your existing database
- Local machine with Node.js, npm, and Git installed
- SSH key pair for EC2 access

---

## Architecture
```
[Your Domain] → [Route 53] → [ALB/EC2] → [Next.js App] → [Supabase PostgreSQL]
```

---

## Step 1: Prepare Your Application for Production

### 1.1 Update Environment Variables
Create an `.env.production.local` file (DO NOT commit this):

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Production App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_APP_NAME=SPORTIKON Arena

# Admin Portal Secret Path (CHANGE THIS)
NEXT_PUBLIC_ADMIN_SECRET_PATH=your-secret-admin-path

# Cache Configuration
CACHE_REVALIDATE_TIME=60
LIVE_SCORE_POLL_INTERVAL=5000
```

### 1.2 Build Locally to Test
```bash
npm run build
npm start
```

---

## Step 2: Create an EC2 Instance

### 2.1 Launch EC2 Instance
1. Go to AWS Console → **EC2 Dashboard** → **Instances**
2. Click **Launch Instances**
3. Configure:
   - **Name**: `sportikon-app`
   - **AMI**: Ubuntu 24.04 LTS (Free Tier eligible)
   - **Instance Type**: `t3.micro` or `t2.micro` (Free Tier)
   - **Key Pair**: Create new or select existing
   - **Security Group**: Create new with:
     - **Inbound Rules**:
       - SSH (Port 22): Only from your IP (0.0.0.0/0 if needed but NOT recommended)
       - HTTP (Port 80): 0.0.0.0/0
       - HTTPS (Port 443): 0.0.0.0/0
   - **Storage**: 20GB (Free Tier allows up to 30GB)
   - **Launch**

### 2.2 Get Your EC2 Public IP
- Go to **Instances** → Select your instance → Copy **Public IPv4 address**

---

## Step 3: Setup EC2 Server

### 3.1 Connect to EC2 (Windows PowerShell)
```powershell
# Navigate to where you saved your key pair
cd C:\Users\YourUsername\Downloads

# Connect via SSH
ssh -i "your-key-pair.pem" ubuntu@<your-ec2-public-ip>
```

### 3.2 Update System and Install Dependencies
```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install Node.js and npm (v20)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Git
sudo apt install -y git

# Install PM2 (process manager)
sudo npm install -g pm2

# Install Nginx (reverse proxy)
sudo apt install -y nginx

# Verify installations
node --version
npm --version
nginx --version
```

---

## Step 4: Deploy Your Application

### 4.1 Clone Your Repository
```bash
# Generate SSH key on EC2 (if using GitHub SSH)
ssh-keygen -t ed25519 -C "your-email@example.com"

# Add public key to GitHub Settings → SSH Keys

# Clone your repo
cd ~
git clone <your-repository-url>
cd sportikon
```

### 4.2 Install Dependencies and Build
```bash
# Install npm dependencies
npm install

# Build the Next.js application
npm run build
```

### 4.3 Setup PM2 Configuration
Create `ecosystem.config.js`:
```bash
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'sportikon',
    script: 'npm',
    args: 'start',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      NEXT_PUBLIC_APP_URL: 'https://your-domain.com'
    },
    instances: 'max',
    exec_mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '500M'
  }]
};
EOF
```

### 4.4 Start Application with PM2
```bash
# Start the app
pm2 start ecosystem.config.js

# Setup autostart on server reboot
pm2 startup
pm2 save

# Monitor
pm2 monitor
```

---

## Step 5: Configure Nginx as Reverse Proxy

### 5.1 Create Nginx Configuration
```bash
sudo nano /etc/nginx/sites-available/sportikon
```

Paste the following configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Redirect HTTP to HTTPS (after SSL is setup)
    # return 301 https://$server_name$request_uri;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeouts for real-time features
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css text/javascript application/javascript application/json;
    gzip_min_length 1000;
}
```

### 5.2 Enable the Configuration
```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/sportikon /etc/nginx/sites-enabled/

# Remove default config
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

---

## Step 6: Setup SSL Certificate (HTTPS)

### 6.1 Install Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 6.2 Get SSL Certificate
```bash
# First, point your domain to your EC2 public IP (DNS A record)
# Then run:
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### 6.3 Update Nginx for HTTPS
Certbot will automatically update your Nginx config. Verify:
```bash
sudo nginx -t
sudo systemctl restart nginx
```

---

## Step 7: Setup Auto-Renewal for SSL

```bash
# Enable automatic renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Check renewal will work
sudo certbot renew --dry-run
```

---

## Step 8: Monitor and Maintain

### Check Application Status
```bash
# SSH into EC2
ssh -i "your-key-pair.pem" ubuntu@<your-ec2-public-ip>

# Check PM2 status
pm2 status
pm2 logs

# Check Nginx
sudo systemctl status nginx
sudo tail -f /var/log/nginx/access.log
```

### Update Application
```bash
# Pull latest changes
git pull origin main

# Rebuild
npm run build

# Restart PM2
pm2 restart sportikon
```

---

## Step 9: Cost Optimization for Learner Lab

### Key Points:
- ✅ **Free Tier** (12 months):
  - 750 hours/month t2.micro or t3.micro EC2
  - 20GB EBS storage
  
- 🚨 **Watch Out For**:
  - Data transfer costs (outbound data charged)
  - EBS snapshots
  - Elastic IPs (if not attached)

### Recommendations:
1. Use only **t3.micro** instance (Free Tier eligible)
2. Stop instance when not in use:
   ```bash
   aws ec2 stop-instances --instance-ids <your-instance-id> --region us-east-1
   ```
3. Monitor costs in AWS Billing Dashboard
4. Set up AWS Budget alerts

---

## Troubleshooting

### Application won't start
```bash
pm2 logs sportikon
```

### Nginx not proxying
```bash
sudo nginx -t
sudo systemctl restart nginx
sudo tail -f /var/log/nginx/error.log
```

### Database connection fails
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Check Supabase database is running
- Verify security group allows EC2 to reach Supabase

### Out of memory errors
- Increase EC2 instance size (move to t3.small or t2.small)
- Reduce PM2 instances in `ecosystem.config.js`

---

## Security Best Practices

1. ✅ Always use HTTPS (SSL certificate)
2. ✅ Restrict SSH access by IP (in Security Group)
3. ✅ Change `NEXT_PUBLIC_ADMIN_SECRET_PATH` in production
4. ✅ Never commit `.env.production.local`
5. ✅ Use IAM roles instead of access keys
6. ✅ Keep system packages updated
7. ✅ Use strong SSH key pair (not auto-generated)

---

## Useful Commands

```bash
# SSH into EC2
ssh -i "your-key-pair.pem" ubuntu@<your-ec2-public-ip>

# Check EC2 instance status
aws ec2 describe-instances --instance-ids <instance-id> --region us-east-1

# View logs
pm2 logs sportikon
sudo tail -f /var/log/nginx/access.log

# Rebuild and restart
cd ~/sportikon && npm run build && pm2 restart sportikon

# Check disk space
df -h

# Check memory
free -m
```

---

## Next Steps After Deployment

1. ✅ Test all features (fixtures, standings, live scoring, news)
2. ✅ Setup monitoring (CloudWatch, PM2 Plus)
3. ✅ Configure backups for Supabase
4. ✅ Setup custom domain (Route 53)
5. ✅ Configure CDN (CloudFront) for static assets
6. ✅ Setup analytics

---

## Support Resources

- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Supabase Documentation](https://supabase.com/docs)
- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [Nginx Documentation](https://nginx.org/en/docs/)

