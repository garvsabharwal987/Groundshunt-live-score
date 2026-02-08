# Quick Start: Deploy SPORTIKON to AWS in 15 Minutes

## TL;DR - Fast Track ⚡

### Prerequisites
- AWS Learner Lab account (active)
- SSH installed on your computer
- Your repository URL (GitHub/GitLab)

### 5 Simple Steps

#### Step 1: Create EC2 Instance (3 min)
1. Go to **AWS Console** → **EC2**
2. Click **Instances** → **Launch Instances**
3. Select: **Ubuntu 24.04 LTS** → **t3.micro** (Free Tier)
4. Security Group → Add rules for:
   - SSH (22)
   - HTTP (80)
   - HTTPS (443)
5. Launch and download key pair `.pem` file

#### Step 2: Connect to Instance (2 min)
```powershell
# Windows PowerShell
cd C:\path\to\key\folder
ssh -i "your-key.pem" ubuntu@<your-ec2-public-ip>
```

#### Step 3: Run Automated Setup (5 min)
```bash
# On your EC2 instance
wget https://raw.githubusercontent.com/YOUR_USERNAME/sportikon/main/deploy-setup.sh
chmod +x deploy-setup.sh
bash deploy-setup.sh https://github.com/YOUR_USERNAME/sportikon.git
```

#### Step 4: Configure Nginx (3 min)
```bash
# On EC2 instance
sudo nano /etc/nginx/sites-available/sportikon
```
Copy from `nginx.conf.example`, replace `your-domain.com` with your IP or domain.

```bash
sudo ln -s /etc/nginx/sites-available/sportikon /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

#### Step 5: Verify and Access (2 min)
```bash
# On EC2
pm2 status
pm2 logs

# In browser
http://<your-ec2-public-ip>
```

---

## Before You Deploy - Important! ⚠️

### ✅ Must Have
1. **Supabase URL and Key** - Get from Supabase Dashboard → Settings → API
2. **Git Repository** - Push your code to GitHub/GitLab
3. **Domain (optional)** - For custom domain + HTTPS
4. **SSH Key Pair** - Downloaded and stored safely

### ✅ Setup Locally First
```bash
# Test build locally
npm run build
npm start

# Open browser and verify: http://localhost:3000
```

### ✅ Prepare Environment Variables
Copy `.env.production.local.example` to `.env.production.local` and fill in:
```env
NEXT_PUBLIC_SUPABASE_URL=<your-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-key>
NEXT_PUBLIC_APP_URL=<your-domain-or-ip>
```

---

## Deployment Decision Tree 🌳

### Option A: Using EC2 Public IP (Simplest)
- ✅ Fastest deployment
- ❌ IP may change if you stop instance
- ⏱️ Deploy in 15 minutes

**Steps**: Follow "5 Simple Steps" above, skip domain setup

---

### Option B: Using Custom Domain (Better)
- ✅ Professional appearance
- ✅ SSL certificate included
- ⏱️ Deploy in 30 minutes

**Extra steps after Step 4**:
1. Register domain (Route 53, GoDaddy, Namecheap, etc.)
2. Point domain DNS A record to EC2 public IP
3. Run: `sudo certbot --nginx -d your-domain.com`
4. Verify: https://your-domain.com

---

## Common Issues & Fixes

### ❌ Application won't load
```bash
# Check logs
pm2 logs sportikon
pm2 status

# Check Nginx
sudo nginx -t
sudo systemctl status nginx
tail -f /var/log/nginx/error.log
```

### ❌ Can't connect to Supabase
```bash
# Verify .env variables
cat ~/.env.production.local

# Check Supabase is running and credentials are correct
```

### ❌ SSL certificate won't generate
```bash
# Ensure domain is pointing to EC2 IP
nslookup your-domain.com

# Run certbot again
sudo certbot --nginx -d your-domain.com
```

### ❌ Out of memory
```bash
# Check memory
free -m

# Reduce PM2 instances
nano ~/sportikon/ecosystem.config.js
# Change: instances: 'max' → instances: 1 or 2
pm2 restart sportikon
```

---

## Cost Check 💰

### Free Tier (12 months from sign-up)
- ✅ t3.micro/t2.micro: 750 hrs/month
- ✅ 20GB EBS storage
- ✅ 1GB/month data transfer

### Monthly Cost (Learner Lab)
- **$0** if you stay within free tier limits ✅
- **Watch**: Data transfer costs (usually minimal)

### How to Monitor
1. Go to **AWS Billing Dashboard**
2. Check **Current Month** charges
3. Set budget alerts for safety

---

## Post-Deployment Checklist

- [ ] Application loads at `http://<your-ip>`
- [ ] Supabase data displays correctly
- [ ] Admin panel works (if domain uses custom secret path)
- [ ] PM2 shows app is running: `pm2 status`
- [ ] No critical errors in logs: `pm2 logs sportikon`
- [ ] AWS Billing shows < $1 (if newly activated)

---

## Next Steps (After Deployment)

### Immediately
1. Test all features thoroughly
2. Check browser console for errors
3. Monitor PM2 dashboard for crashes

### Week 1
1. Setup SSL certificate if using domain
2. Configure CloudFront CDN for static assets
3. Setup Supabase backups

### Ongoing
1. Monitor AWS costs weekly
2. Update dependencies monthly
3. Check Nginx error logs
4. Review application performance

---

## Useful Commands Reference

```bash
# SSH into instance
ssh -i "key.pem" ubuntu@<ip>

# Check application
pm2 status
pm2 logs sportikon -f  # Follow logs
pm2 restart sportikon
pm2 stop sportikon

# Check Nginx
sudo nginx -t
sudo systemctl status nginx
sudo systemctl restart nginx
sudo tail -f /var/log/nginx/error.log

# Check system resources
free -m  # Memory
df -h    # Disk
top      # System info

# Update and rebuild
cd ~/sportikon
git pull
npm install
npm run build
pm2 restart sportikon

# Database operations
npm run db:push    # Push schema changes
npm run db:generate  # Generate types

# Stop instance (to save costs)
aws ec2 stop-instances --instance-ids i-0123456789abcdef0 --region us-east-1
```

---

## Support & Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs
- **AWS EC2 Docs**: https://docs.aws.amazon.com/ec2/
- **Nginx Docs**: https://nginx.org/en/docs/
- **PM2 Docs**: https://pm2.keymetrics.io/docs/

---

## AWS Learner Lab Time Limits ⏰

- **Session Duration**: 3-4 hours per session
- **Account Lifetime**: Check your learner lab dashboard
- **Credit Limit**: Free credits provided by institution
- **Action**: Stop instances before session ends to preserve resources

---

**Ready to deploy? Start with Step 1 above!** 🚀

Questions? Check `AWS_DEPLOYMENT_GUIDE.md` for detailed instructions.
