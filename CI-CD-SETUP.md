# 🚀 BamVoo Automated CI/CD Pipeline Setup

This guide will help you set up a completely automated deployment pipeline for BamVoo using GitHub Actions.

## 📋 Overview

The pipeline includes:
- ✅ **Automated Testing**: Unit tests, integration tests, security scans
- ✅ **Multi-Environment Deployment**: Staging and Production
- ✅ **Security Scanning**: Vulnerability checks and dependency audits
- ✅ **Build Artifacts**: Automated packaging and deployment
- ✅ **Notifications**: Deployment status updates
- ✅ **Environment Protection**: Approval workflows for production

## 🔧 Prerequisites

### 1. GitHub Repository Setup

1. **Create GitHub repository**:
   ```bash
   git init
   git add .
   git commit -m "Initial BamVoo Alexa skill"
   git branch -M main
   git remote add origin https://github.com/yourusername/bamvoo.git
   git push -u origin main
   ```

2. **Create develop branch**:
   ```bash
   git checkout -b develop
   git push -u origin develop
   ```

### 2. AWS Setup

1. **Create AWS IAM User**:
   ```bash
   # Create IAM user for CI/CD
   aws iam create-user --user-name bamvoo-cicd
   
   # Attach necessary policies
   aws iam attach-user-policy --user-name bamvoo-cicd --policy-arn arn:aws:iam::aws:policy/AdministratorAccess
   
   # Create access keys
   aws iam create-access-key --user-name bamvoo-cicd
   ```

2. **Required AWS Permissions**:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "lambda:*",
           "apigateway:*",
           "iam:*",
           "cloudwatch:*",
           "logs:*",
           "s3:*"
         ],
         "Resource": "*"
       }
     ]
   }
   ```

### 3. GitHub Secrets Setup

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these secrets:

#### **AWS Credentials**
```
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
```

#### **OctoEverywhere Configuration**
```
OCTO_APP_TOKEN=your_octoeverywhere_app_token
```

#### **Alexa Configuration (Staging)**
```
ALEXA_SKILL_ID_STAGING=amzn1.ask.skill.staging_skill_id
ALEXA_ACCESS_TOKEN_STAGING=your_staging_access_token
```

#### **Alexa Configuration (Production)**
```
ALEXA_SKILL_ID_PROD=amzn1.ask.skill.production_skill_id
ALEXA_ACCESS_TOKEN_PROD=your_production_access_token
```

#### **Optional: Notifications**
```
SLACK_WEBHOOK_URL=your_slack_webhook_url
DISCORD_WEBHOOK_URL=your_discord_webhook_url
SNYK_TOKEN=your_snyk_token
```

## 🔄 Pipeline Workflow

### **Branch Strategy**
```
main (production) ← develop (staging) ← feature branches
```

### **Deployment Flow**
1. **Feature Development**: Create feature branches from `develop`
2. **Staging**: Push to `develop` → Auto-deploy to staging
3. **Production**: Merge `develop` to `main` → Auto-deploy to production

### **Pipeline Stages**

#### **1. Test Stage** 🧪
- Runs on: `main`, `develop`, PRs
- Actions:
  - ✅ Install dependencies
  - ✅ Run local tests
  - ✅ Run unit tests
  - ✅ Upload test coverage

#### **2. Security Stage** 🔒
- Runs on: `main`, `develop`, PRs
- Actions:
  - ✅ npm audit
  - ✅ Snyk security scan
  - ✅ Dependency vulnerability check

#### **3. Build Stage** 🏗️
- Runs on: `main`, `develop`, PRs
- Actions:
  - ✅ Build package
  - ✅ Create deployment artifacts
  - ✅ Upload build artifacts

#### **4. Deploy Staging** 🚀
- Runs on: `develop` branch only
- Actions:
  - ✅ Deploy to AWS Lambda (staging)
  - ✅ Configure environment variables
  - ✅ Update Alexa skill endpoint

#### **5. Deploy Production** 🚀
- Runs on: `main` branch only
- Actions:
  - ✅ Deploy to AWS Lambda (production)
  - ✅ Configure environment variables
  - ✅ Update Alexa skill endpoint

## 🛠️ Manual Setup Steps

### 1. Create Alexa Skills

#### **Staging Skill**
1. Go to [Alexa Developer Console](https://developer.amazon.com/alexa/console/ask)
2. Create skill: "BamVoo Staging"
3. Invocation name: "bamvoo staging"
4. Note the Skill ID for `ALEXA_SKILL_ID_STAGING`

#### **Production Skill**
1. Create skill: "BamVoo"
2. Invocation name: "bamvoo"
3. Note the Skill ID for `ALEXA_SKILL_ID_PROD`

### 2. Configure OctoEverywhere

1. Get your App Token from [OctoEverywhere API](https://octoeverywhere.stoplight.io/docs/octoeverywhere-api-docs)
2. Add to `OCTO_APP_TOKEN` secret

### 3. Set Up Webhooks

#### **Staging Webhook**
```
URL: https://your-api-gateway-staging.amazonaws.com/staging/webhook
Events: PrintFinished, PrintFailed, PrintStarted, PrintPaused, PrintResumed
```

#### **Production Webhook**
```
URL: https://your-api-gateway-production.amazonaws.com/prod/webhook
Events: PrintFinished, PrintFailed, PrintStarted, PrintPaused, PrintResumed
```

## 🔄 Development Workflow

### **Daily Development**
```bash
# 1. Create feature branch
git checkout develop
git pull origin develop
git checkout -b feature/new-feature

# 2. Make changes
# ... edit files ...

# 3. Test locally
npm run test:local

# 4. Commit and push
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature

# 5. Create PR to develop
# GitHub will run tests automatically
```

### **Staging Deployment**
```bash
# 1. Merge feature to develop
git checkout develop
git merge feature/new-feature
git push origin develop

# 2. Pipeline automatically deploys to staging
# Check GitHub Actions for status
```

### **Production Deployment**
```bash
# 1. Merge develop to main
git checkout main
git merge develop
git push origin main

# 2. Pipeline automatically deploys to production
# Check GitHub Actions for status
```

## 📊 Monitoring & Alerts

### **GitHub Actions Monitoring**
- ✅ **Success**: Green checkmark in Actions tab
- ❌ **Failure**: Red X with detailed error logs
- ⏳ **In Progress**: Yellow dot with live status

### **AWS CloudWatch Monitoring**
```bash
# View Lambda logs
aws logs describe-log-groups --log-group-name-prefix "/aws/lambda/bamvoo"

# View recent logs
aws logs tail /aws/lambda/bamvoo-staging-alexaSkill --follow
```

### **Alexa Skill Monitoring**
- Monitor skill usage in Alexa Developer Console
- Check error rates and response times
- Review user feedback and ratings

## 🚨 Troubleshooting

### **Common Issues**

#### **Pipeline Fails on Test Stage**
```bash
# Check local tests
npm run test:local

# Check unit tests
npm test

# Fix any failing tests before pushing
```

#### **Deployment Fails**
```bash
# Check AWS credentials
aws sts get-caller-identity

# Check Lambda function status
aws lambda get-function --function-name bamvoo-staging-alexaSkill

# Check CloudWatch logs
aws logs describe-log-streams --log-group-name /aws/lambda/bamvoo-staging-alexaSkill
```

#### **Environment Variables Missing**
```bash
# Verify secrets are set in GitHub
# Go to Settings → Secrets and variables → Actions
# Ensure all required secrets are present
```

### **Manual Deployment (Fallback)**
```bash
# If pipeline fails, deploy manually
export OCTO_APP_TOKEN=your_token
export ALEXA_SKILL_ID=your_skill_id
export ALEXA_ACCESS_TOKEN=your_access_token

./deploy.sh
```

## 📈 Performance Optimization

### **Lambda Optimization**
- ✅ **Memory**: 256MB (adequate for Alexa skills)
- ✅ **Timeout**: 30 seconds (sufficient for API calls)
- ✅ **Cold Start**: ~1-2 seconds (acceptable)

### **API Optimization**
- ✅ **Caching**: Session attributes for printer selection
- ✅ **Error Handling**: Graceful degradation
- ✅ **Rate Limiting**: Respect API limits

## 🔐 Security Best Practices

### **Secrets Management**
- ✅ **GitHub Secrets**: All sensitive data stored securely
- ✅ **Environment Variables**: No hardcoded secrets
- ✅ **IAM Roles**: Minimal required permissions

### **Code Security**
- ✅ **Dependency Scanning**: Automated vulnerability checks
- ✅ **Input Validation**: All user inputs validated
- ✅ **Error Handling**: No sensitive data in error messages

## 📝 Maintenance

### **Regular Tasks**
- [ ] **Weekly**: Review CloudWatch logs for errors
- [ ] **Monthly**: Update dependencies and security patches
- [ ] **Quarterly**: Review and update IAM permissions
- [ ] **Annually**: Review and update Alexa skill certification

### **Monitoring Checklist**
- [ ] Pipeline success rate > 95%
- [ ] Lambda response time < 3 seconds
- [ ] Error rate < 1%
- [ ] Security scan passes
- [ ] Test coverage > 80%

---

## 🎉 Success Metrics

Your automated pipeline is working when:

✅ **Code pushed to `develop`** → **Auto-deploys to staging**  
✅ **Code merged to `main`** → **Auto-deploys to production**  
✅ **Tests pass** → **Deployment proceeds**  
✅ **Tests fail** → **Deployment blocked**  
✅ **Security issues** → **Deployment blocked**  
✅ **Deployment success** → **Team notified**  

## 🆘 Support

- **Pipeline Issues**: Check GitHub Actions logs
- **Deployment Issues**: Check AWS CloudWatch logs
- **Alexa Issues**: Check Alexa Developer Console
- **Security Issues**: Review Snyk and npm audit reports

---

**Ready to automate?** Follow this guide step by step and you'll have a fully automated CI/CD pipeline for BamVoo! 🚀 