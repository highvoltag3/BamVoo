# 🚀 BamVoo Automated Deployment Pipeline

## ✅ What We've Built

### **Complete Alexa Skill**
- **Name**: BamVoo (Bambu Voice)
- **Invocation**: "Alexa, open BamVoo"
- **Features**: Multi-printer support, real-time status, notifications, webcam snapshots

### **Automated CI/CD Pipeline**
- **Testing**: Local tests, unit tests, security scans
- **Deployment**: Staging (develop branch) and Production (main branch)
- **Monitoring**: GitHub Actions, CloudWatch logs, notifications

## 🔄 Pipeline Flow

```
Feature Branch → Develop → Main
     ↓           ↓        ↓
   Tests      Staging  Production
     ↓           ↓        ↓
   Build      Deploy    Deploy
     ↓           ↓        ↓
   Security   Notify    Notify
```

## 📁 Project Structure

```
BamVo/
├── 📄 index.js                    # Main Lambda function
├── 📄 webhook-handler.js          # Notification handler
├── 📄 skill.json                  # Alexa interaction model
├── 📄 serverless.yml              # AWS deployment config
├── 📄 package.json                # Dependencies
├── 📄 .github/workflows/          # CI/CD pipeline
├── 📄 test/                       # Unit tests
├── 📄 test-local.js               # Local testing
├── 📄 deploy.sh                   # Manual deployment
├── 📄 setup-github.sh             # GitHub setup
├── 📄 CI-CD-SETUP.md             # Complete setup guide
├── 📄 TESTING.md                  # Testing guide
└── 📄 README.md                   # Main documentation
```

## 🎯 Quick Start

### **1. Set Up Repository**
```bash
./setup-github.sh
```

### **2. Add GitHub Secrets**
Go to Settings → Secrets and variables → Actions:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `OCTO_APP_TOKEN`
- `ALEXA_SKILL_ID_STAGING`
- `ALEXA_ACCESS_TOKEN_STAGING`
- `ALEXA_SKILL_ID_PROD`
- `ALEXA_ACCESS_TOKEN_PROD`

### **3. Deploy Automatically**
```bash
# Push to develop → Auto-deploy to staging
git push origin develop

# Merge to main → Auto-deploy to production
git merge develop
git push origin main
```

## 🧪 Testing

### **Local Testing**
```bash
npm run test:local
```

### **Manual Deployment**
```bash
./deploy.sh
```

### **Pipeline Testing**
- Push to `develop` → Tests run automatically
- Check GitHub Actions for results
- View CloudWatch logs for deployment status

## 📊 Monitoring

### **GitHub Actions**
- ✅ **Success**: Green checkmark
- ❌ **Failure**: Red X with logs
- ⏳ **Running**: Yellow dot

### **AWS CloudWatch**
```bash
# View Lambda logs
aws logs tail /aws/lambda/bamvoo-staging-alexaSkill --follow
```

### **Alexa Developer Console**
- Monitor skill usage
- Check error rates
- Review user feedback

## 🔧 Manual Override

If pipeline fails, deploy manually:
```bash
export OCTO_APP_TOKEN=your_token
export ALEXA_SKILL_ID=your_skill_id
export ALEXA_ACCESS_TOKEN=your_access_token

./deploy.sh
```

## 🎉 Success Indicators

Your automated pipeline is working when:

✅ **Code pushed to `develop`** → **Auto-deploys to staging**  
✅ **Code merged to `main`** → **Auto-deploys to production**  
✅ **Tests pass** → **Deployment proceeds**  
✅ **Tests fail** → **Deployment blocked**  
✅ **Security issues** → **Deployment blocked**  
✅ **Deployment success** → **Team notified**  

## 📚 Documentation

- **Setup Guide**: `CI-CD-SETUP.md` - Complete setup instructions
- **Testing Guide**: `TESTING.md` - All testing methods
- **Main README**: `README.md` - Project overview and usage

## 🆘 Support

- **Pipeline Issues**: Check GitHub Actions logs
- **Deployment Issues**: Check AWS CloudWatch logs
- **Alexa Issues**: Check Alexa Developer Console
- **Setup Issues**: Follow `CI-CD-SETUP.md` step by step

---

**🎯 Ready to automate?** Run `./setup-github.sh` and follow the setup guide! 🚀 