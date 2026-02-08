# AWS Deployment Architecture & Timeline

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     INTERNET / USERS                             │
└────────────────────────────┬────────────────────────────────────┘
                             │
                    ┌────────▼─────────┐
                    │   Your Domain    │
                    │ (your-site.com)  │
                    └────────┬─────────┘
                             │ DNS Points to EC2 Public IP
                    ┌────────▼─────────────────┐
                    │   AWS EC2 Instance       │
                    │   (Ubuntu 24.04 LTS)     │
                    │   (t3.micro - Free Tier) │
                    └────────┬─────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
    ┌───▼────┐         ┌─────▼──────┐      ┌─────▼──────┐
    │ Port 80│         │ Port 443   │      │ Port 3000  │
    │(HTTP)  │         │(HTTPS/SSL) │      │ (Node.js)  │
    └───┬────┘         └─────┬──────┘      └─────┬──────┘
        │                    │                    │
        └────────────────────┴────────────────────┘
                      │
            ┌─────────▼──────────┐
            │    NGINX PROXY     │
            │  (Reverse Proxy)   │
            └─────────┬──────────┘
                      │
            ┌─────────▼──────────────┐
            │   Next.js App          │
            │   (Node.js Process)    │
            │   (Running on :3000)   │
            └─────────┬──────────────┘
                      │
    ┌─────────────────┼──────────────────┐
    │                 │                  │
    │                 │                  │
┌───▼─────┐     ┌─────▼──────┐    ┌──────▼────┐
│ Supabase│     │  Redis     │    │ Filesystem│
│PostgreSQL   │   (Optional) │    │ (Logs)    │
└──────────┘     └────────────┘    └───────────┘
    (Cloud)
```

---

## Deployment Timeline

### Day 1: Preparation (30 minutes)

**9:00 AM** - Setup AWS Account
- [ ] Log into AWS Learner Lab
- [ ] Select region: `us-east-1`
- [ ] Check credit balance: ✅

**9:10 AM** - Prepare Application
- [ ] Pull latest code
- [ ] Test locally: `npm run build && npm start`
- [ ] Create `.env.production.local`
- [ ] Git commit and push

**9:20 AM** - Create EC2 Instance
- [ ] Launch Instance: Ubuntu 24.04 LTS, t3.micro
- [ ] Create/Select key pair
- [ ] Configure security group (SSH, HTTP, HTTPS)
- [ ] Note public IP address

**9:30 AM** - Setup Complete ✅

---

### Day 1: Deployment (45 minutes)

**10:00 AM** - SSH and Initial Setup
```bash
ssh -i "key.pem" ubuntu@<ip>
sudo apt update && sudo apt upgrade -y
```

**10:05 AM** - Install Dependencies
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git nginx certbot python3-certbot-nginx pm2
sudo npm install -g pm2
```

**10:10 AM** - Deploy Application
```bash
git clone <repo-url> sportikon
cd sportikon
npm install
npm run build
```

**10:20 AM** - Configure Application
- [ ] Create `.env.production.local`
- [ ] Create `ecosystem.config.js`
- [ ] Start with PM2: `pm2 start ecosystem.config.js`
- [ ] Configure PM2 startup: `pm2 startup && pm2 save`

**10:25 AM** - Configure Nginx
```bash
sudo nano /etc/nginx/sites-available/sportikon
# Copy nginx.conf.example content
sudo ln -s /etc/nginx/sites-available/sportikon /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl restart nginx
```

**10:30 AM** - Test Application
```bash
curl http://localhost:3000
curl http://<your-ip>
# Should see application homepage
```

**10:35 AM** - Setup Domain (if using custom domain)
- [ ] Update DNS A record to EC2 public IP
- [ ] Wait for DNS propagation (5 min - 48 hours)

**10:40 AM** - SSL Certificate (if using domain)
```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
# Follow prompts
```

**10:45 AM** - Final Verification
```bash
pm2 status          # Should show sportikon ONLINE
pm2 logs sportikon  # Check for errors
sudo systemctl status nginx  # Should be active
```

**✅ 10:50 AM - LIVE!**

Access your application:
- HTTP: `http://<your-ec2-public-ip>` or `http://your-domain.com`
- HTTPS: `https://your-domain.com` (if SSL setup)

---

## Post-Deployment Checklist

### Immediately (First Hour)

```
⏱️ 11:00 AM - Verification
├─ [ ] Open app in browser
├─ [ ] Check homepage loads
├─ [ ] Verify database connection (see data)
├─ [ ] Test fixtures page
├─ [ ] Test standings page
├─ [ ] Test news page
├─ [ ] Check live scoring (if available)
└─ [ ] Check admin panel

⏱️ 11:15 AM - Security Check
├─ [ ] Verify HTTPS is working (if domain)
├─ [ ] Check browser shows green lock
├─ [ ] No console errors (F12 → Console)
└─ [ ] No warnings about certificates

⏱️ 11:30 AM - Performance Check
├─ [ ] Pages load in < 2 seconds
├─ [ ] Check PM2 logs for errors
├─ [ ] Monitor memory usage
└─ [ ] Check Nginx error log
```

### Day 1 - End of Day

```
⏱️ 5:00 PM - Daily Wrap-up
├─ [ ] Application still running
├─ [ ] No critical errors in logs
├─ [ ] Check AWS billing (should be ~$0)
├─ [ ] Document any issues encountered
└─ [ ] Commit any final changes
```

### Week 1 - Daily Checks

```
Monday - Wednesday:
├─ [ ] Application uptime
├─ [ ] Database performance
├─ [ ] No memory leaks
└─ [ ] SSL certificate status

Thursday - Friday:
├─ [ ] Full feature test
├─ [ ] Performance baseline
├─ [ ] AWS cost review
└─ [ ] Backup status
```

### Week 2+ - Weekly Checks

```
Every Monday:
├─ [ ] Application health
├─ [ ] Database backups
├─ [ ] AWS costs
├─ [ ] Security updates
└─ [ ] Performance metrics
```

---

## Cost Timeline

### Learner Lab Charges

```
Day 1 - 30 days:
├─ EC2 (t3.micro): $0 (Free Tier)
├─ EBS Storage (20GB): $0 (Free Tier)
├─ Data Transfer: ~$0 (minimal traffic)
└─ Total: $0 ✅

Day 31 onwards:
├─ Only applicable if free tier expires
└─ Estimated: $5-10/month if not careful
```

### What Costs Money

❌ **Chargeable**:
- Large EC2 instances (t3.small and above)
- Outbound data transfer (> 1GB/month = ~$0.09/GB)
- Elastic IPs (not attached)
- EBS snapshots

✅ **Free**:
- t3.micro EC2
- 20GB EBS storage
- 1GB/month data transfer
- Route 53 basic DNS
- SSL certificates

---

## Monitoring Timeline

### Real-Time (Every Hour)

```
Minute 0:  Check PM2 status
Minute 15: Check CPU/Memory
Minute 30: Check Nginx logs
Minute 45: Check application response time
```

### Daily (Each Morning)

```
9:00 AM: ✅ Application running?
9:05 AM: ✅ Database connected?
9:10 AM: ✅ Any errors overnight?
9:15 AM: ✅ AWS costs reasonable?
```

### Weekly (Monday)

```
Week 1:  Performance baseline
Week 2:  Compare to Week 1
Week 3:  Identify trends
Week 4:  Plan optimizations
```

---

## Rollback Timeline (If Issues)

### Issue Detected ⚠️

```
T+0:00   Problem identified
         Check logs: pm2 logs sportikon
         
T+0:05   Quick restart
         pm2 restart sportikon
         
T+0:10   If persists, check logs
         pm2 logs sportikon --lines 100
         
T+0:15   If database issue
         Verify .env variables
         Check Supabase status
         
T+0:30   If still broken, rebuild
         npm run build
         pm2 restart sportikon
         
T+0:45   If critical, revert code
         git reset --hard <previous-commit>
         npm install && npm run build
         pm2 restart sportikon
         
T+1:00   Investigate root cause
         Check error logs
         Review recent changes
```

---

## Update Timeline

### Monthly Updates

```
First Monday of each month:
├─ [ ] Update npm packages: npm audit
├─ [ ] Update Next.js if major version available
├─ [ ] Check Supabase version
├─ [ ] Review AWS console for deprecation warnings
└─ [ ] Plan any required migration work
```

### Quarterly Security Audit

```
Every 3 months:
├─ [ ] Review security group rules
├─ [ ] Check SSL certificate expiration
├─ [ ] Audit Supabase permissions
├─ [ ] Review access logs for suspicious activity
└─ [ ] Update dependencies
```

---

## Emergency Procedures Timeline

### If Application Crashes

```
T+0:00   Alert! Application down
T+0:01   SSH into instance
T+0:02   Check PM2 status: pm2 status
T+0:03   Check logs: pm2 logs sportikon -n 50
T+0:05   Attempt restart: pm2 restart sportikon
T+0:10   If restart fails, check system resources
T+0:15   If system overloaded, upgrade instance type
T+0:20   If code issue, git revert to last known good
T+0:30   Document incident and root cause
```

### If Database Disconnects

```
T+0:00   Users report data not loading
T+0:01   Check Supabase status: https://status.supabase.com
T+0:05   Verify credentials in .env file
T+0:10   Restart application
T+0:15   Check network connectivity
T+0:20   Contact Supabase support if persists
```

### If SSL Certificate Fails

```
T+0:00   Users see "certificate error"
T+0:01   Check certificate: openssl x509 -text -noout -in cert.pem
T+0:05   Verify domain DNS points to EC2
T+0:10   Attempt renewal: sudo certbot renew
T+0:15   If renewal fails, regenerate: sudo certbot certonly --nginx -d domain.com
T+0:20   Restart Nginx: sudo systemctl restart nginx
```

---

## Success Milestones 🎯

### ✅ Day 1 - Deployment Successful
- Application accessible
- Database connected
- Basic functionality working
- SSL certificate installed (if domain)

### ✅ Week 1 - Stability Verified
- Zero crashes observed
- No memory leaks
- Performance acceptable
- All features tested

### ✅ Month 1 - Production Ready
- Monitoring in place
- Backup strategy confirmed
- Cost within budget
- Update process established

### ✅ Going Forward - Optimized
- Auto-scaling configured
- CDN enabled (optional)
- Analytics tracking
- Regular backups running

---

**Your deployment journey from start to success! 🚀**

For detailed troubleshooting at any stage, see `TROUBLESHOOTING.md`
