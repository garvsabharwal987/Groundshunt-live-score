# AWS Deployment Troubleshooting Guide

## Diagnosis Commands

Run these commands on your EC2 instance to diagnose issues:

### 1. Check Application Status

```bash
# Is PM2 running the app?
pm2 status

# View real-time logs
pm2 logs sportikon

# View last 50 lines of logs
pm2 logs sportikon --lines 50

# Show detailed app info
pm2 show sportikon

# Restart the app
pm2 restart sportikon

# Stop the app
pm2 stop sportikon

# Start the app again
pm2 start ecosystem.config.js
```

### 2. Check Nginx Reverse Proxy

```bash
# Test Nginx configuration syntax
sudo nginx -t

# Check Nginx status
sudo systemctl status nginx

# View Nginx error log (real-time)
sudo tail -f /var/log/nginx/error.log

# View Nginx access log
sudo tail -f /var/log/nginx/access.log

# View SPORTIKON-specific logs (if configured)
sudo tail -f /var/log/nginx/sportikon_error.log

# Restart Nginx
sudo systemctl restart nginx

# Check if Nginx is listening on port 80 and 443
sudo netstat -tlnp | grep nginx
```

### 3. Check Network Connectivity

```bash
# Is the app running on port 3000?
curl http://localhost:3000

# Is Nginx proxying correctly?
curl http://localhost  # Should proxy to app

# Check open ports
sudo netstat -tlnp

# Test DNS resolution (if using domain)
nslookup your-domain.com

# Test connectivity to Supabase
curl https://your-supabase-url.supabase.co/rest/v1/

# Check public IP
curl ifconfig.me
```

### 4. Check System Resources

```bash
# Memory usage
free -m

# Disk usage
df -h

# CPU usage (real-time)
top

# Check if process is using too much memory
ps aux | grep node

# Monitor in real-time
watch -n 1 free -m
```

### 5. Check Environment Variables

```bash
# View all environment variables loaded by Node
npm start 2>&1 | head -20

# Check .env file exists
ls -la ~/.env.production.local

# View .env file (be careful, contains secrets!)
cat ~/.env.production.local

# Check permissions (should be 600)
ls -l ~/.env.production.local
```

---

## Common Problems & Solutions

### Problem 1: Application Won't Start

**Error**: `pm2 status` shows app as stopped or crashed

**Diagnosis**:
```bash
pm2 logs sportikon
npm run build  # See if there are build errors
```

**Solutions**:
```bash
# Clear and rebuild
rm -rf .next
npm install
npm run build
pm2 restart sportikon

# If still failing, check Node version
node --version  # Should be v18+ or v20+

# Check if port 3000 is already in use
lsof -i :3000
kill -9 <PID>  # Kill the process using port 3000
pm2 restart sportikon
```

---

### Problem 2: "Cannot GET /" - App Not Responding

**Error**: Browser shows "Cannot GET /" or times out

**Diagnosis**:
```bash
# Is app running?
pm2 status

# Is app listening on port 3000?
curl http://localhost:3000

# Is Nginx running?
sudo systemctl status nginx

# Are ports open?
sudo netstat -tlnp | grep -E ':(80|443|3000)'
```

**Solutions**:
```bash
# Restart everything
pm2 restart sportikon
sudo systemctl restart nginx

# If Nginx shows error, check syntax
sudo nginx -t

# Check Nginx configuration for typos
sudo cat /etc/nginx/sites-available/sportikon

# Verify app is building correctly
npm run build
```

---

### Problem 3: Database Connection Error

**Error**: "Error connecting to Supabase" or data not loading

**Diagnosis**:
```bash
# Check .env variables
cat ~/.env.production.local

# Test Supabase connectivity
curl https://your-supabase-url.supabase.co/rest/v1/

# Check if keys are valid (they should contain "eyJ" at start)
grep SUPABASE ~/.env.production.local
```

**Solutions**:
```bash
# 1. Verify keys are correct
# Go to Supabase Dashboard → Settings → API
# Copy CORRECT URL and ANON_KEY

# 2. Update .env file
nano ~/.env.production.local
# Update NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY

# 3. Restart app
pm2 restart sportikon

# 4. Check logs
pm2 logs sportikon | grep -i supabase
```

---

### Problem 4: SSL Certificate Issues

**Error**: Browser warning about invalid certificate or "Unable to get issuer certificate"

**Diagnosis**:
```bash
# Check certificate validity
sudo openssl x509 -in /etc/letsencrypt/live/your-domain.com/cert.pem -text -noout

# Check if domain DNS is pointing to this IP
nslookup your-domain.com

# Test SSL connection
openssl s_client -connect your-domain.com:443
```

**Solutions**:
```bash
# 1. Ensure domain DNS is pointing to EC2 IP
# Update DNS A record in registrar (GoDaddy, Route 53, etc.)

# 2. Wait for DNS propagation (up to 48 hours)
# Check status: nslookup your-domain.com

# 3. Regenerate certificate
sudo certbot delete --cert-name your-domain.com
sudo certbot --nginx -d your-domain.com

# 4. Check renewal is scheduled
sudo systemctl status certbot.timer
```

---

### Problem 5: Out of Memory Error

**Error**: Application crashes or PM2 shows "out of memory"

**Diagnosis**:
```bash
# Check memory usage
free -m
top  # Press 'q' to exit

# Check PM2 memory limit
pm2 show sportikon | grep memory

# See which processes use most memory
ps aux --sort=-%mem | head -5
```

**Solutions**:
```bash
# 1. Increase memory by reducing Node instances
nano ecosystem.config.js
# Change: instances: 'max' → instances: 1 or 2
pm2 restart sportikon

# 2. Enable application swap memory (risky)
# Contact AWS support or upgrade instance

# 3. Stop other services
sudo systemctl stop nginx  # Temporarily
pm2 restart sportikon

# 4. Upgrade EC2 instance (costs money)
# Stop instance → Change instance type → Start
```

---

### Problem 6: High CPU Usage

**Error**: Application slow, CPU at 100%, or instance becomes unresponsive

**Diagnosis**:
```bash
# Check which process uses CPU
top

# Monitor Node CPU usage
ps aux | grep node

# Check for infinite loops in logs
pm2 logs sportikon | tail -100
```

**Solutions**:
```bash
# 1. Check for database issues
# Monitor Supabase performance

# 2. Reduce live score polling interval
nano ~/.env.production.local
# Increase: LIVE_SCORE_POLL_INTERVAL=5000 → 10000

# 3. Reduce PM2 instances
nano ecosystem.config.js
# Change: instances: 'max' → instances: 1

# 4. Restart app
pm2 restart sportikon
```

---

### Problem 7: "502 Bad Gateway" Error

**Error**: Browser shows "502 Bad Gateway"

**Diagnosis**:
```bash
# Is the Node app running?
curl http://localhost:3000

# Is Nginx running?
sudo systemctl status nginx

# Check Nginx error log
sudo tail -f /var/log/nginx/error.log
```

**Solutions**:
```bash
# 1. Start Node app if stopped
pm2 start ecosystem.config.js

# 2. Check if port 3000 is already in use
lsof -i :3000

# 3. Verify Nginx proxy configuration
sudo cat /etc/nginx/sites-available/sportikon
# Look for: proxy_pass http://localhost:3000;

# 4. Restart Nginx
sudo systemctl restart nginx

# 5. Check syntax
sudo nginx -t
```

---

### Problem 8: Application Stops After System Reboot

**Error**: EC2 instance reboots and application doesn't start automatically

**Diagnosis**:
```bash
# Is PM2 startup configured?
pm2 startup

# Check PM2 status
pm2 status
```

**Solutions**:
```bash
# 1. Configure PM2 to auto-start
pm2 startup
pm2 save

# 2. Verify configuration
sudo cat /etc/systemd/system/pm2-ubuntu.service

# 3. Reboot and test
sudo reboot

# 4. After reboot, check status
pm2 status
```

---

### Problem 9: Static Files Not Loading (CSS, JS)

**Error**: Website loads but styling is broken, scripts don't run

**Diagnosis**:
```bash
# Check browser console (F12) for 404 errors
# Look for files like: /_next/static/...

# Check Nginx access log
sudo grep "_next" /var/log/nginx/access.log | tail -20
```

**Solutions**:
```bash
# 1. Ensure .next folder exists and is built
ls -la ~/.next/

# 2. Rebuild static files
npm run build

# 3. Verify Nginx is serving static files correctly
# Check nginx.conf for correct _next/static location block

# 4. Clear browser cache
# In browser: Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac)

# 5. Restart app
pm2 restart sportikon
```

---

### Problem 10: Can't SSH into Instance

**Error**: Connection refused or timeout

**Diagnosis**:
```bash
# Windows PowerShell
ssh -i "your-key.pem" ubuntu@<ip> -v  # Verbose mode

# Common issues:
# 1. Wrong IP address
# 2. Key pair permissions
# 3. Security group doesn't allow SSH
```

**Solutions**:
```bash
# 1. Fix key permissions (Windows)
# Right-click .pem file → Properties → Security
# Remove all permissions, add only your user with Full Control

# 2. Verify security group allows SSH
# AWS Console → EC2 → Security Groups
# Add inbound rule: SSH (22) from your IP

# 3. Try again with verbose output
ssh -i "your-key.pem" ubuntu@<ip> -vvv
```

---

## Emergency Recovery Commands

### If Everything is Broken

```bash
# 1. SSH into instance
ssh -i "your-key.pem" ubuntu@<ip>

# 2. Check what's running
pm2 status
sudo systemctl status nginx

# 3. View all logs
pm2 logs sportikon
sudo tail -f /var/log/nginx/error.log

# 4. Kill everything and restart
pm2 kill
pm2 start ecosystem.config.js
sudo systemctl restart nginx

# 5. If that doesn't work, restart instance
sudo reboot

# 6. Verify after restart
pm2 status
sudo systemctl status nginx
curl http://localhost:3000
```

### Reset Everything (Nuclear Option)

```bash
# ⚠️ WARNING: This deletes everything and starts fresh

# 1. SSH into instance
ssh -i "your-key.pem" ubuntu@<ip>

# 2. Kill all Node processes
pkill -f node
pm2 delete all

# 3. Remove application and reinstall
rm -rf ~/sportikon
cd ~
git clone <your-repo-url> sportikon
cd sportikon

# 4. Rebuild
npm install
npm run build

# 5. Create .env.production.local with correct values
nano .env.production.local

# 6. Start fresh
pm2 start ecosystem.config.js
pm2 startup
pm2 save

# 7. Restart Nginx
sudo systemctl restart nginx
```

---

## Performance Monitoring Setup

### Real-Time Dashboard

```bash
# Start PM2 monitoring
pm2 monitor

# Or use web dashboard
pm2 web
# Access at: http://localhost:9615
```

### Continuous Monitoring

```bash
# Watch system resources
watch -n 1 'pm2 status && echo "---" && free -m && echo "---" && df -h'

# Watch logs continuously
pm2 logs sportikon -f

# Watch Nginx access
sudo tail -f /var/log/nginx/access.log
```

---

## Performance Tuning

### Optimize Node.js

```bash
# Edit PM2 config
nano ecosystem.config.js

# Adjust these values:
# - instances: Number of Node processes (reduce if OOM)
# - max_memory_restart: Restart if exceeds (e.g., '500M')
# - autorestart: true/false
# - watch: false (set true only for dev)

# Apply changes
pm2 restart sportikon
```

### Optimize Nginx

```bash
# Edit Nginx config
sudo nano /etc/nginx/nginx.conf

# Add these for better performance:
# worker_processes auto;  # Use all CPU cores
# worker_connections 1024;  # Max connections per worker
# keepalive_timeout 65;

sudo systemctl restart nginx
```

---

## Logs Location Reference

- **PM2 logs**: `~/sportikon/logs/`
- **Nginx access log**: `/var/log/nginx/access.log`
- **Nginx error log**: `/var/log/nginx/error.log`
- **SPORTIKON error log**: `/var/log/nginx/sportikon_error.log`
- **System log**: `/var/log/syslog`
- **PM2 daemon log**: `~/.pm2/pm2.log`

---

## Quick Reference: Common Commands

```bash
# Application management
pm2 start ecosystem.config.js
pm2 stop sportikon
pm2 restart sportikon
pm2 delete sportikon
pm2 logs sportikon

# System checks
free -m                    # Memory
df -h                      # Disk
top                        # CPU/Processes
netstat -tlnp              # Open ports

# Nginx management
sudo systemctl start nginx
sudo systemctl stop nginx
sudo systemctl restart nginx
sudo nginx -t              # Test config

# SSH into instance
ssh -i "key.pem" ubuntu@<ip>

# Copy file to instance
scp -i "key.pem" file.txt ubuntu@<ip>:~/

# Copy file from instance
scp -i "key.pem" ubuntu@<ip>:~/file.txt .
```

---

**Last Updated**: February 7, 2025
**For SPORTIKON Arena on AWS Learner Lab**
