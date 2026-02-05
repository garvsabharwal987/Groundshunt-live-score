# SPORTIKON Arena - Deployment Guide

This guide covers deploying SPORTIKON Arena on AWS EC2 with NGINX as a reverse proxy.

## Prerequisites

- AWS Account
- Domain name (optional, but recommended)
- Supabase project set up with schema

## Architecture Overview

```
Internet → Route 53 → CloudFront (optional) → ALB/NGINX → EC2 (Next.js)
                                                           ↓
                                                    Supabase (External)
```

## Step 1: Set Up Supabase

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note down:
   - Project URL: `https://xxxxx.supabase.co`
   - Anon Key: `eyJ...`
   - Service Role Key: `eyJ...` (keep secret!)

### 1.2 Run Database Schema

1. Go to SQL Editor in Supabase Dashboard
2. Copy contents of `database/schema.sql`
3. Execute the SQL

### 1.3 Enable Realtime

1. Go to Database → Replication
2. Enable realtime for these tables:
   - `fixtures`
   - `live_scores`
   - `news_of_the_day`
   - `announcements`

### 1.4 Create Admin User

In Supabase SQL Editor:

```sql
-- First, create auth user via Supabase Dashboard (Authentication → Users)
-- Then update the users table:
UPDATE users 
SET role = 'super_admin' 
WHERE email = 'admin@yourdomain.com';
```

## Step 2: Launch EC2 Instance

### 2.1 Instance Configuration

- **AMI**: Amazon Linux 2023 or Ubuntu 22.04 LTS
- **Instance Type**: t3.medium (minimum for production)
- **Storage**: 20GB gp3
- **Security Group**:
  - SSH (22) - Your IP only
  - HTTP (80) - 0.0.0.0/0
  - HTTPS (443) - 0.0.0.0/0

### 2.2 Connect to Instance

```bash
ssh -i your-key.pem ec2-user@your-ec2-ip
# or for Ubuntu:
ssh -i your-key.pem ubuntu@your-ec2-ip
```

### 2.3 Install Dependencies (Amazon Linux 2023)

```bash
# Update system
sudo dnf update -y

# Install Node.js 20
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo dnf install -y nodejs

# Install Git
sudo dnf install -y git

# Install PM2 globally
sudo npm install -g pm2

# Install NGINX
sudo dnf install -y nginx
```

### 2.3 Install Dependencies (Ubuntu 22.04)

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Git
sudo apt install -y git

# Install PM2 globally
sudo npm install -g pm2

# Install NGINX
sudo apt install -y nginx
```

## Step 3: Deploy Application

### 3.1 Clone Repository

```bash
cd /home/ec2-user  # or /home/ubuntu
git clone https://github.com/your-repo/sportikon.git
cd sportikon
```

### 3.2 Environment Configuration

```bash
# Create production environment file
cat > .env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJ...your-service-role-key
NEXT_PUBLIC_APP_URL=https://yourdomain.com
EOF

# Secure the file
chmod 600 .env.local
```

### 3.3 Build Application

```bash
# Install dependencies
npm ci --production=false

# Build for production
npm run build
```

### 3.4 Start with PM2

```bash
# Start the application
pm2 start npm --name "sportikon" -- start

# Save PM2 configuration
pm2 save

# Set PM2 to start on boot
pm2 startup
# Follow the command output to run the startup script
```

## Step 4: Configure NGINX

### 4.1 Create NGINX Configuration

```bash
sudo nano /etc/nginx/conf.d/sportikon.conf
```

Add the following configuration:

```nginx
# Rate limiting zone
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=general_limit:10m rate=30r/s;

# Upstream for Next.js
upstream nextjs_upstream {
    server 127.0.0.1:3000;
    keepalive 64;
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect to HTTPS (uncomment after SSL setup)
    # return 301 https://$server_name$request_uri;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json application/xml;

    # Static files caching
    location /_next/static {
        proxy_cache_valid 60m;
        proxy_pass http://nextjs_upstream;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # API routes with rate limiting
    location /api/ {
        limit_req zone=api_limit burst=20 nodelay;
        proxy_pass http://nextjs_upstream;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Admin portal (additional rate limiting)
    location /arena-admin {
        limit_req zone=general_limit burst=10 nodelay;
        proxy_pass http://nextjs_upstream;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # All other routes
    location / {
        limit_req zone=general_limit burst=50 nodelay;
        proxy_pass http://nextjs_upstream;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "OK";
        add_header Content-Type text/plain;
    }
}
```

### 4.2 Test and Start NGINX

```bash
# Test configuration
sudo nginx -t

# Start NGINX
sudo systemctl start nginx
sudo systemctl enable nginx
```

## Step 5: SSL Certificate (Let's Encrypt)

### 5.1 Install Certbot

```bash
# Amazon Linux 2023
sudo dnf install -y certbot python3-certbot-nginx

# Ubuntu 22.04
sudo apt install -y certbot python3-certbot-nginx
```

### 5.2 Obtain Certificate

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### 5.3 Auto-renewal

```bash
# Test renewal
sudo certbot renew --dry-run

# Certbot automatically sets up cron job for renewal
```

## Step 6: Monitoring & Logging

### 6.1 PM2 Monitoring

```bash
# View application status
pm2 status

# View logs
pm2 logs sportikon

# Monitor resources
pm2 monit
```

### 6.2 NGINX Logs

```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log
```

### 6.3 Set Up CloudWatch (Optional)

```bash
# Install CloudWatch agent
sudo dnf install amazon-cloudwatch-agent -y

# Configure for custom metrics
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-config-wizard
```

## Step 7: Scaling for 10,000+ Users

### 7.1 Horizontal Scaling with ALB

1. Create AMI of configured EC2 instance
2. Create Auto Scaling Group with:
   - Min: 2 instances
   - Max: 10 instances
   - Target tracking: 70% CPU utilization
3. Create Application Load Balancer
4. Configure health checks to `/health`

### 7.2 Performance Optimizations

1. **Enable CloudFront CDN**:
   - Cache static assets
   - Edge locations for global users

2. **Supabase Connection Pooling**:
   - Enable PgBouncer in Supabase settings
   - Use transaction mode for serverless

3. **Redis Cache** (optional):
   - Use ElastiCache for session storage
   - Cache frequently accessed data

### 7.3 Database Optimization

In Supabase SQL Editor:

```sql
-- Create indexes for frequently queried columns
CREATE INDEX IF NOT EXISTS idx_fixtures_status ON fixtures(status);
CREATE INDEX IF NOT EXISTS idx_fixtures_date ON fixtures(match_date);
CREATE INDEX IF NOT EXISTS idx_live_scores_fixture ON live_scores(fixture_id);

-- Enable query performance insights
ALTER SYSTEM SET pg_stat_statements.track = 'all';
```

## Troubleshooting

### Application Won't Start

```bash
# Check PM2 logs
pm2 logs sportikon --lines 100

# Check if port 3000 is in use
sudo lsof -i :3000

# Restart application
pm2 restart sportikon
```

### NGINX 502 Bad Gateway

```bash
# Check if Next.js is running
pm2 status

# Check NGINX error logs
sudo tail -f /var/log/nginx/error.log

# Restart services
pm2 restart sportikon
sudo systemctl restart nginx
```

### High Memory Usage

```bash
# Check memory
free -h

# Restart PM2 with memory limit
pm2 delete sportikon
pm2 start npm --name "sportikon" --max-memory-restart 500M -- start
```

## Security Checklist

- [ ] SSH key authentication only (disable password auth)
- [ ] Security groups properly configured
- [ ] SSL/TLS enabled with valid certificate
- [ ] Environment variables secured
- [ ] Regular security updates enabled
- [ ] Supabase RLS policies active
- [ ] Rate limiting configured
- [ ] Admin portal URL not easily guessable
- [ ] Regular backups configured
- [ ] Monitoring and alerting set up

## Backup Strategy

### Database Backups

Supabase provides automatic daily backups. For additional safety:

```bash
# Manual backup via pg_dump (requires Supabase Pro)
pg_dump -h db.xxxxx.supabase.co -U postgres -d postgres > backup.sql
```

### Application Backups

```bash
# Backup application code and environment
tar -czvf sportikon-backup-$(date +%Y%m%d).tar.gz \
  /home/ec2-user/sportikon/.env.local \
  /etc/nginx/conf.d/sportikon.conf
```

## Maintenance

### Updating the Application

```bash
cd /home/ec2-user/sportikon

# Pull latest changes
git pull origin main

# Install dependencies
npm ci --production=false

# Build
npm run build

# Restart with zero downtime
pm2 reload sportikon
```

### System Updates

```bash
# Amazon Linux
sudo dnf update -y

# Ubuntu
sudo apt update && sudo apt upgrade -y
```

---

## Quick Reference

| Service | Command |
|---------|---------|
| Start app | `pm2 start sportikon` |
| Stop app | `pm2 stop sportikon` |
| Restart app | `pm2 restart sportikon` |
| View logs | `pm2 logs sportikon` |
| Start NGINX | `sudo systemctl start nginx` |
| Stop NGINX | `sudo systemctl stop nginx` |
| Reload NGINX | `sudo systemctl reload nginx` |
| Test NGINX config | `sudo nginx -t` |
| Renew SSL | `sudo certbot renew` |

---

For support, check the [Supabase Documentation](https://supabase.com/docs) and [Next.js Documentation](https://nextjs.org/docs).
