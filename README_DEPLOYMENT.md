# SPORTIKON Arena - AWS Deployment Package
## Complete Guide & Ready-to-Use Configuration

---

## 📚 Documentation Files Created

This deployment package includes everything you need:

### 1. **QUICK_START_DEPLOYMENT.md** ⭐ START HERE
   - 15-minute fast deployment guide
   - Decision trees for different scenarios
   - Common fixes for quick reference
   - **Best for**: Getting live in minutes

### 2. **AWS_DEPLOYMENT_GUIDE.md**
   - Comprehensive 9-step deployment guide
   - Detailed architecture explanation
   - Security best practices
   - Cost optimization tips
   - **Best for**: Understanding the full process

### 3. **DEPLOYMENT_CHECKLIST.md**
   - Pre, during, and post-deployment checklist
   - Success criteria verification
   - Emergency procedures
   - **Best for**: Ensuring nothing is forgotten

### 4. **TROUBLESHOOTING.md**
   - Diagnosis commands for every scenario
   - 10 common problems with solutions
   - Emergency recovery procedures
   - Performance monitoring setup
   - **Best for**: Fixing issues when they arise

### 5. **DEPLOYMENT_ARCHITECTURE.md**
   - System architecture diagram
   - Deployment timeline
   - Cost tracking timeline
   - Monitoring procedures
   - **Best for**: Understanding the bigger picture

---

## 🚀 Ready-to-Use Configuration Files

### 1. **deploy-setup.sh**
Automated bash script for EC2 setup. Usage:
```bash
bash deploy-setup.sh https://github.com/YOUR_USERNAME/sportikon.git
```
Installs: Node.js, npm, PM2, Nginx, Git, Certbot

### 2. **.env.production.local.example**
Template for production environment variables. Fill in your values:
```
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
```

### 3. **nginx.conf.example**
Ready-to-use Nginx configuration with:
- HTTPS/SSL support
- WebSocket upgrade
- Gzip compression
- Security headers
- Real-time polling support

---

## 🎯 Quick Decision: Where to Start?

### "I want to deploy in 15 minutes"
→ Read: `QUICK_START_DEPLOYMENT.md`
→ Follow: 5 Simple Steps section
→ Use: `deploy-setup.sh`

### "I want detailed step-by-step instructions"
→ Read: `AWS_DEPLOYMENT_GUIDE.md`
→ Follow: All 9 steps sequentially
→ Use: Configuration templates provided

### "I'm having deployment issues"
→ Read: `TROUBLESHOOTING.md`
→ Find: Your specific problem
→ Run: Diagnosis commands

### "I want to understand the complete setup"
→ Read: `DEPLOYMENT_ARCHITECTURE.md`
→ Study: Architecture diagram
→ Review: Timeline and procedures

---

## 📋 Pre-Deployment Checklist

### ✅ Have You Prepared?

- [ ] Supabase project created and database initialized
- [ ] Project pushed to GitHub/GitLab repository
- [ ] `.env.production.local.example` filled with your real values
- [ ] Tested locally: `npm run build && npm start`
- [ ] AWS Learner Lab account is active
- [ ] Credit balance checked in AWS
- [ ] SSH knowledge (if not, follow `QUICK_START_DEPLOYMENT.md`)

---

## 🔑 Essential Information You'll Need

### From Supabase
```
NEXT_PUBLIC_SUPABASE_URL: https://xyz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY: eyJhbGciOi... (long string)
```
Get from: Supabase Dashboard → Settings → API

### From Your EC2 Instance
```
Public IPv4 Address: 54.xxx.xxx.xxx
SSH Key Pair: your-key.pem (downloaded and saved)
Region: us-east-1 (recommended)
```

### From Your Domain (Optional)
```
Domain: your-domain.com
Registrar: GoDaddy, Route53, etc.
DNS A Record: Points to EC2 Public IP
```

---

## 🏃 5-Minute Quick Start

```bash
# 1. Create EC2 instance (3 min)
# AWS Console → EC2 → Launch Instance
# Select: Ubuntu 24.04, t3.micro, Download Key Pair

# 2. SSH into instance (1 min)
ssh -i "your-key.pem" ubuntu@<your-ip>

# 3. Run automated setup (5 min, then wait ~2 min to build)
bash deploy-setup.sh https://github.com/your-username/sportikon.git

# 4. Configure Nginx
sudo nano /etc/nginx/sites-available/sportikon
# Copy from nginx.conf.example

# 5. Access your app (2 min)
# Browser: http://<your-ec2-public-ip>
```

---

## 💰 Cost Management

### Free Tier (12 months)
- ✅ t3.micro EC2: $0
- ✅ 20GB EBS Storage: $0
- ✅ SSL Certificate: $0
- ✅ Domain first year: ~$10 (if purchased)

### Monthly Budget Recommendation
- **Conservative**: $0 (stay within free tier)
- **Comfortable**: $5 (small buffer)
- **Safe Maximum**: $10 (safety net)

### How to Monitor
1. AWS Console → Billing Dashboard
2. Set budget alert: Services → Budgets → Create Budget
3. Alert threshold: $5/month

---

## 🔒 Security Reminders

### CRITICAL SECURITY STEPS
1. ⚠️ Change `NEXT_PUBLIC_ADMIN_SECRET_PATH` in production
   - Before: `/arena-admin` (predictable)
   - After: `/secret-admin-xyz-123` (random, hard to guess)

2. ⚠️ Never commit `.env.production.local` to Git
   - Add to `.gitignore`: `.env.production.local`

3. ⚠️ Keep SSH key secure
   - Don't share, don't email, don't store in cloud
   - Store locally: `C:\Users\YourName\AWS\`

4. ⚠️ Restrict SSH access by IP
   - Security Group → SSH Port 22 → Restrict by your IP
   - Instead of: `0.0.0.0/0`

5. ⚠️ Always use HTTPS in production
   - Use certbot for free SSL: `sudo certbot --nginx -d domain.com`

---

## 📊 Deployment Summary

### What Gets Deployed

```
┌─────────────────────────────────────────┐
│     Your Next.js Application           │
│  (Runs inside EC2 on Port 3000)        │
└────────────────┬────────────────────────┘
                 │ Proxied by Nginx
┌────────────────▼────────────────────────┐
│        Nginx Reverse Proxy              │
│  (Handles SSL, HTTP→HTTPS, Compression)│
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│      AWS EC2 Instance (Ubuntu)          │
│  (t3.micro - in Free Tier)              │
└────────────────┬────────────────────────┘
                 │ Connects to
┌────────────────▼────────────────────────┐
│     Supabase PostgreSQL Database        │
│  (Managed by Supabase - External)       │
└─────────────────────────────────────────┘
```

### Technology Stack

- **Compute**: AWS EC2 (t3.micro)
- **Web Server**: Nginx (reverse proxy)
- **Runtime**: Node.js v20 LTS
- **Application**: Next.js 14 (React)
- **Database**: Supabase (PostgreSQL)
- **SSL/TLS**: Let's Encrypt (Certbot)
- **Process Manager**: PM2 (auto-restart, monitoring)

---

## 📞 Support Resources

### Documentation
- [AWS EC2 Docs](https://docs.aws.amazon.com/ec2/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Docs](https://supabase.com/docs)
- [Nginx Docs](https://nginx.org/en/docs/)

### Your Files
1. `QUICK_START_DEPLOYMENT.md` - Fast deployment
2. `AWS_DEPLOYMENT_GUIDE.md` - Detailed guide
3. `TROUBLESHOOTING.md` - Problem solving
4. `DEPLOYMENT_CHECKLIST.md` - Verification

### Community Help
- [Stack Overflow - Next.js](https://stackoverflow.com/questions/tagged/next.js)
- [AWS Learner Lab Forums](https://forums.aws.amazon.com/)
- [Supabase Discord](https://discord.supabase.com)

---

## ✅ Success Looks Like This

### After 1 Hour
```
✅ Application accessible at http://<your-ip>
✅ Pages load and show data
✅ Admin panel works
✅ No errors in console
✅ PM2 shows app running
```

### After 1 Day
```
✅ Application still running (no crashes)
✅ All features tested
✅ SSL certificate installed (if using domain)
✅ Backups configured
✅ Monitoring active
```

### After 1 Week
```
✅ Zero downtime observed
✅ Performance stable
✅ Database queries fast
✅ Costs within budget
✅ Security verified
```

---

## 🎓 Learning Resources

### AWS Concepts
- **EC2**: Virtual servers in the cloud
- **Security Groups**: Virtual firewalls
- **EBS**: Persistent storage
- **Free Tier**: First 12 months of free AWS services

### Deployment Concepts
- **Reverse Proxy**: Nginx sits in front and handles SSL, load balancing
- **Process Manager**: PM2 restarts app if it crashes
- **SSL Certificate**: HTTPS encryption for security
- **Auto-startup**: Application starts after server reboot

---

## 🚨 Important Reminders

### Before You Deploy
1. ✅ Test locally: `npm run build && npm start`
2. ✅ Push code to Git
3. ✅ Save SSH key securely
4. ✅ Have Supabase credentials ready

### During Deployment
1. ✅ Follow documentation step-by-step
2. ✅ Don't skip security steps
3. ✅ Test thoroughly before going live
4. ✅ Save all configuration changes

### After Deployment
1. ✅ Monitor for first 24 hours
2. ✅ Check AWS costs weekly
3. ✅ Keep dependencies updated
4. ✅ Maintain backups

---

## 📞 Troubleshooting Quick Links

| Problem | Solution |
|---------|----------|
| Can't SSH | Check security group, key permissions, IP |
| App won't start | Check logs: `pm2 logs sportikon` |
| Database error | Verify .env variables, check Supabase status |
| 502 Gateway error | Check if app running on :3000, Nginx config |
| Out of memory | Reduce PM2 instances or upgrade EC2 |
| SSL certificate failed | Ensure domain DNS points to EC2 IP |
| Too much AWS cost | Ensure using t3.micro, stop unused instances |

---

## 🎯 Next Steps

### Immediate (Now)
1. Read `QUICK_START_DEPLOYMENT.md` or `AWS_DEPLOYMENT_GUIDE.md`
2. Gather credentials (Supabase URL and key)
3. Prepare `.env.production.local` file

### Short-term (Today)
1. Create EC2 instance
2. Run `deploy-setup.sh`
3. Configure Nginx
4. Test application

### Medium-term (This Week)
1. Setup domain and SSL
2. Configure monitoring
3. Setup backups
4. Verify security

### Long-term (Ongoing)
1. Monitor costs
2. Update dependencies
3. Review logs
4. Plan scaling

---

## 📚 File Reference

| File | Purpose | Read Time |
|------|---------|-----------|
| QUICK_START_DEPLOYMENT.md | 15-min deployment | 5 min |
| AWS_DEPLOYMENT_GUIDE.md | Complete guide | 20 min |
| TROUBLESHOOTING.md | Problem solving | 15 min |
| DEPLOYMENT_CHECKLIST.md | Verification | 10 min |
| DEPLOYMENT_ARCHITECTURE.md | Architecture | 10 min |
| deploy-setup.sh | Automated setup | - (script) |
| .env.production.local.example | Env template | - (config) |
| nginx.conf.example | Web server config | - (config) |

---

## 🏁 Ready to Deploy?

### ⚡ For Speed: 15 Minutes
```
1. Create EC2 (3 min)
2. SSH in (1 min)
3. Run deploy-setup.sh (8 min)
4. Configure Nginx (2 min)
5. Access app (1 min)
```

### 📖 For Understanding: 1 Hour
```
1. Read AWS_DEPLOYMENT_GUIDE.md (20 min)
2. Follow step-by-step (40 min)
3. Test everything (optional)
```

### 🎓 For Learning: 2 Hours
```
1. Read DEPLOYMENT_ARCHITECTURE.md (20 min)
2. Read AWS_DEPLOYMENT_GUIDE.md (30 min)
3. Deploy following guide (40 min)
4. Review TROUBLESHOOTING.md (10 min)
```

---

**You have everything you need. Start with your chosen guide above! 🚀**

Questions? Check the appropriate documentation file or `TROUBLESHOOTING.md`

---

*Created: February 7, 2025*
*For: SPORTIKON Arena*
*Platform: AWS Learner Lab*
*Stack: Next.js + Supabase + EC2 + Nginx*
