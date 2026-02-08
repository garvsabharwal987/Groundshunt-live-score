# AWS Deployment Checklist for SPORTIKON Arena

## Pre-Deployment (Your Local Machine)

- [ ] Git repository is created and pushed to GitHub/GitLab
- [ ] Supabase project is live and database is initialized
- [ ] Update `.env.production.local.example` with real values
- [ ] Test build locally: `npm run build && npm start`
- [ ] All secrets are stored securely (never commit `.env.production.local`)
- [ ] SSH key pair downloaded and stored safely on your computer

---

## AWS Learner Lab Setup

- [ ] Learner Lab account is active
- [ ] AWS Learner Lab credit balance is checked
- [ ] Region selected: **us-east-1** (most free tier services)

---

## EC2 Instance Setup

- [ ] EC2 instance created (t3.micro or t2.micro)
  - Ubuntu 24.04 LTS
  - Free tier eligible
  - 20GB storage
- [ ] Security Group configured:
  - [ ] Port 22 (SSH) - restrict by IP if possible
  - [ ] Port 80 (HTTP) - 0.0.0.0/0
  - [ ] Port 443 (HTTPS) - 0.0.0.0/0
- [ ] Key pair downloaded and saved securely
- [ ] Instance public IP address noted: `_________________`
- [ ] Can SSH into instance successfully

---

## Server Configuration

### On EC2 Instance
- [ ] System packages updated: `sudo apt update && sudo apt upgrade -y`
- [ ] Node.js v20 installed
- [ ] npm installed
- [ ] Git installed
- [ ] PM2 installed globally
- [ ] Nginx installed
- [ ] Certbot installed (for SSL)

### Application Deployment
- [ ] Repository cloned from GitHub: `cd ~`
- [ ] Dependencies installed: `npm install`
- [ ] Application built: `npm run build`
- [ ] `.env.production.local` file created with correct values
- [ ] Permissions set correctly: `chmod 600 .env.production.local`
- [ ] PM2 ecosystem.config.js created
- [ ] Application started with PM2: `pm2 start ecosystem.config.js`
- [ ] PM2 startup configured: `pm2 startup && pm2 save`

---

## Nginx Setup

- [ ] Nginx configuration file created: `/etc/nginx/sites-available/sportikon`
- [ ] Nginx site enabled: `sudo ln -s /etc/nginx/sites-available/sportikon /etc/nginx/sites-enabled/`
- [ ] Default site disabled: `sudo rm /etc/nginx/sites-enabled/default`
- [ ] Nginx config tested: `sudo nginx -t` (should show `OK`)
- [ ] Nginx restarted: `sudo systemctl restart nginx`
- [ ] Nginx enabled on boot: `sudo systemctl enable nginx`
- [ ] Application accessible at: `http://<your-ec2-public-ip>`

---

## Domain & DNS (If using custom domain)

- [ ] Domain name registered (GoDaddy, Route53, etc.)
- [ ] DNS A record pointing to EC2 public IP
- [ ] DNS propagation verified (24-48 hours typical)
- [ ] Can access at: `http://your-domain.com`

---

## SSL Certificate (HTTPS)

- [ ] Domain is pointing to EC2 instance
- [ ] SSL certificate requested: `sudo certbot --nginx -d your-domain.com -d www.your-domain.com`
- [ ] Certificate obtained successfully
- [ ] Auto-renewal enabled: `sudo systemctl enable certbot.timer`
- [ ] Can access at: `https://your-domain.com` ✅ (green lock)
- [ ] HTTP automatically redirects to HTTPS

---

## Testing & Verification

### Application Functionality
- [ ] Home page loads correctly
- [ ] Fixtures page displays data
- [ ] Standings page displays data
- [ ] News page displays articles
- [ ] Live scoring works (check real-time updates)
- [ ] Admin login page accessible at `/arena-admin`
- [ ] Admin portal functions work (or your custom secret path)

### Performance & Monitoring
- [ ] Application response time reasonable (< 1 second)
- [ ] No console errors in browser
- [ ] Check PM2 status: `pm2 status`
- [ ] Check PM2 logs: `pm2 logs sportikon`
- [ ] Monitor memory/CPU: `pm2 monitor`

### Database Connection
- [ ] Can connect to Supabase
- [ ] Data loading correctly
- [ ] Supabase credentials in `.env.production.local` are correct
- [ ] No CORS errors in browser console

---

## Security & Hardening

- [ ] SSH key pair is stored securely (not in shared folders)
- [ ] Security Group only allows necessary ports
- [ ] SSH access restricted by IP (if possible)
- [ ] `.env.production.local` has restrictive permissions: `600`
- [ ] `.env.production.local` added to `.gitignore`
- [ ] Admin secret path is changed from default
- [ ] HTTPS is enabled and enforced
- [ ] SSL certificate auto-renewal is working

---

## Monitoring & Maintenance

- [ ] PM2 is set to auto-restart on reboot
- [ ] Application logs are being collected
- [ ] Nginx logs are accessible
- [ ] AWS Billing alerts are configured
- [ ] EC2 instance size monitoring (stop if not needed)
- [ ] Database backups configured in Supabase

---

## Cost Optimization (Important!)

- [ ] Instance is **t3.micro** or **t2.micro** only (Free Tier)
- [ ] No Elastic IP attached (or attached to running instance)
- [ ] EBS volume is 20GB (Free Tier: 30GB/month)
- [ ] No unnecessary snapshots created
- [ ] Data transfer minimized (outbound data = charges!)
- [ ] Instance stopped when not in use if possible: `aws ec2 stop-instances --instance-ids <id>`
- [ ] AWS Budget alerts set for $5/month threshold
- [ ] Reviewing AWS Billing Dashboard weekly

---

## Post-Deployment

### Week 1
- [ ] Monitor application stability
- [ ] Check Supabase database performance
- [ ] Review AWS costs in Billing Dashboard
- [ ] Test all admin features
- [ ] Get user feedback

### Ongoing
- [ ] Update dependencies monthly: `npm audit`, `npm update`
- [ ] Monitor PM2 dashboard
- [ ] Review Nginx error logs
- [ ] Ensure SSL certificate renewal is working
- [ ] Backup important data from Supabase
- [ ] Monitor EC2 resource usage

---

## Troubleshooting Quick Links

**Issue**: Application won't start
```bash
pm2 logs sportikon
```

**Issue**: Can't access application
```bash
sudo nginx -t
sudo systemctl status nginx
curl http://localhost:3000
```

**Issue**: Database connection error
- Verify `.env.production.local` values
- Check Supabase is running
- Test: `curl https://your-supabase-url.supabase.co/rest/v1/`

**Issue**: SSL certificate not renewing
```bash
sudo certbot renew --dry-run
sudo systemctl status certbot.timer
```

**Issue**: Out of memory
- Reduce PM2 instances in `ecosystem.config.js`
- Increase EC2 instance size (cost implications)

---

## Emergency Contacts & Resources

- AWS Support: [AWS Support Center](https://console.aws.amazon.com/support/)
- Supabase Support: [Supabase Docs](https://supabase.com/docs)
- Next.js Docs: [Deployment](https://nextjs.org/docs/deployment)
- Nginx Docs: [Nginx Documentation](https://nginx.org/en/docs/)

---

## Success Criteria ✅

Your deployment is successful when:

1. ✅ Application accessible at `https://your-domain.com`
2. ✅ All pages load without errors
3. ✅ Admin panel is protected and functional
4. ✅ Database is connected and data is displaying
5. ✅ SSL certificate is valid (green lock in browser)
6. ✅ PM2 shows application is running
7. ✅ No excessive errors in logs
8. ✅ Application responds in < 2 seconds
9. ✅ Free tier costs are within budget

---

**Last Updated**: February 7, 2025
**Project**: SPORTIKON Arena
**Deployment Target**: AWS Learner Lab - EC2 + Supabase
