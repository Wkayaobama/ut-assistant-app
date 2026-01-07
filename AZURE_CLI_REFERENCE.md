# Azure CLI Reference - UT-Assistant

Quick reference for Azure CLI commands needed for this project.

---

## Prerequisites Check

### Verify Azure CLI Installation
```bash
az --version
```
**Expected**: Version 2.x or higher

### Login to Azure
```bash
az login
```
**Action**: Opens browser for authentication

### Login to Specific Tenant
```bash
az login --tenant 9398883c-8dd9-4fd9-b410-e42de5143116
```
**Use when**: Need to authenticate to Demo_SSO tenant specifically

---

## Account & Subscription Management

### Show Current Account
```bash
az account show
```
**Returns**: Current subscription, tenant ID, user

### List All Subscriptions
```bash
az account list --output table
```
**Returns**: Table of all accessible subscriptions

### Set Active Subscription
```bash
az account set --subscription "2f3b1816-d09d-41c5-bf19-110614b6d94c"
```
**Use when**: Need to switch to Azure Sponsorship subscription

### Show Current Tenant
```bash
az account show --query tenantId -o tsv
```
**Returns**: Current tenant ID

---

## Resource Group Management

### Create Resource Group
```bash
az group create \
  --name rg-ut-assistant-fc \
  --location francecentral
```
**Action**: Creates resource group in France Central region

### List Resource Groups
```bash
az group list --output table
```
**Returns**: All resource groups in current subscription

### Show Resource Group
```bash
az group show --name rg-ut-assistant-fc
```
**Returns**: Details of specific resource group

### Delete Resource Group (CAUTION)
```bash
az group delete --name rg-ut-assistant-fc --yes --no-wait
```
**⚠️ WARNING**: Deletes ALL resources in the group permanently

---

## Azure Static Web Apps

### Create Static Web App
```bash
az staticwebapp create \
  --name ut-assistant-app \
  --resource-group rg-ut-assistant-fc \
  --source https://github.com/{ORG}/{REPO} \
  --location francecentral \
  --branch main \
  --app-location "/src" \
  --login-with-github
```
**Prerequisites**:
- GitHub repository exists
- `--login-with-github` will prompt for GitHub OAuth
- Auto-generates GitHub Actions workflow

### List Static Web Apps
```bash
az staticwebapp list --output table
```
**Returns**: All static web apps in subscription

### Show Static Web App Details
```bash
az staticwebapp show \
  --name ut-assistant-app \
  --resource-group rg-ut-assistant-fc
```
**Returns**: Configuration, URL, deployment token

### Get Static Web App URL
```bash
az staticwebapp show \
  --name ut-assistant-app \
  --resource-group rg-ut-assistant-fc \
  --query "defaultHostname" -o tsv
```
**Returns**: Public URL (e.g., `ut-assistant-app.azurestaticapps.net`)

### Get Deployment Token (for GitHub Actions)
```bash
az staticwebapp secrets list \
  --name ut-assistant-app \
  --resource-group rg-ut-assistant-fc \
  --query "properties.apiKey" -o tsv
```
**Returns**: Deployment token for CI/CD
**Note**: Auto-configured by `--login-with-github` flag

### Delete Static Web App
```bash
az staticwebapp delete \
  --name ut-assistant-app \
  --resource-group rg-ut-assistant-fc \
  --yes
```
**Action**: Deletes static web app

---

## Custom Domain Configuration (Optional)

### Add Custom Domain
```bash
az staticwebapp hostname set \
  --name ut-assistant-app \
  --resource-group rg-ut-assistant-fc \
  --hostname assistants.yourdomain.com
```
**Prerequisites**: DNS CNAME record pointing to Azure SWA URL

### List Custom Domains
```bash
az staticwebapp hostname list \
  --name ut-assistant-app \
  --resource-group rg-ut-assistant-fc
```

### Delete Custom Domain
```bash
az staticwebapp hostname delete \
  --name ut-assistant-app \
  --resource-group rg-ut-assistant-fc \
  --hostname assistants.yourdomain.com \
  --yes
```

---

## Entra ID (Azure AD) Management

### List App Registrations
```bash
az ad app list --display-name "UT-Finance-Assistant-SSO" --output table
```
**Returns**: App registrations matching name

### Create App Registration
```bash
az ad app create \
  --display-name "UT-Finance-Assistant-SSO" \
  --sign-in-audience AzureADMyOrg
```
**Returns**: Application (client) ID, object ID

### Get App Registration Details
```bash
az ad app show --id {APPLICATION_ID}
```
**Replace**: {APPLICATION_ID} with Client ID from Entra ID

### Create Client Secret
```bash
az ad app credential reset \
  --id {APPLICATION_ID} \
  --append \
  --years 2
```
**⚠️ IMPORTANT**: Copy client secret immediately - shown only once
**Returns**: Client secret value

### Add Redirect URI
```bash
az ad app update \
  --id {APPLICATION_ID} \
  --web-redirect-uris https://app.understand.tech/auth/callback
```
**Replace**: Redirect URI with value from Understand Tech

### Add API Permissions (Microsoft Graph)
```bash
az ad app permission add \
  --id {APPLICATION_ID} \
  --api 00000003-0000-0000-c000-000000000000 \
  --api-permissions \
    e1fe6dd8-ba31-4d61-89e7-88639da4683d=Scope \
    64a6cdd6-aab1-4aaf-94b8-3cc8405e90d0=Scope \
    14dad69e-099b-42c9-810b-d002981feec1=Scope
```
**Permissions**:
- `e1fe6dd8...` = User.Read
- `64a6cdd6...` = email
- `14dad69e...` = profile

**Note**: Admin consent may be required

### Grant Admin Consent
```bash
az ad app permission admin-consent --id {APPLICATION_ID}
```
**Requires**: Global Administrator or Privileged Role Administrator

---

## Monitoring & Logs

### View Activity Log (Resource Group)
```bash
az monitor activity-log list \
  --resource-group rg-ut-assistant-fc \
  --max-events 50 \
  --output table
```
**Returns**: Recent activity in resource group

### View Static Web App Logs
```bash
# Static Web Apps don't have traditional logs
# Use GitHub Actions logs for deployment issues
# Use browser DevTools for client-side debugging
```

---

## Cost Management

### Show Resource Group Costs (requires Cost Management)
```bash
az consumption usage list \
  --start-date 2026-01-01 \
  --end-date 2026-01-31 \
  --query "[?contains(instanceId, 'rg-ut-assistant-fc')]"
```
**Note**: Azure Static Web Apps has generous free tier

---

## Cleanup Commands

### Complete Cleanup (Delete Everything)
```bash
# Delete resource group (includes all resources)
az group delete --name rg-ut-assistant-fc --yes --no-wait

# Delete Entra ID app registrations (if needed)
az ad app delete --id {APPLICATION_ID_FINANCE}
az ad app delete --id {APPLICATION_ID_GROWTH}
```
**⚠️ WARNING**: Permanent deletion - no recovery

---

## Useful Shortcuts

### Set Default Resource Group
```bash
az configure --defaults group=rg-ut-assistant-fc
```
**Benefit**: Omit `--resource-group` in subsequent commands

### Set Default Location
```bash
az configure --defaults location=francecentral
```

### Reset Defaults
```bash
az configure --defaults group= location=
```

### Output Formats
```bash
# Table (human-readable)
az {command} --output table

# JSON (default, parsable)
az {command} --output json

# YAML (readable)
az {command} --output yaml

# TSV (scripting)
az {command} --output tsv

# None (suppress output)
az {command} --output none
```

---

## Common Troubleshooting

### "Subscription not found"
```bash
# List all subscriptions
az account list --all --output table

# Login again
az login

# Set subscription explicitly
az account set --subscription {SUBSCRIPTION_ID}
```

### "Insufficient permissions"
```bash
# Check current user role assignments
az role assignment list \
  --assignee $(az ad signed-in-user show --query id -o tsv) \
  --output table
```

### "Resource provider not registered"
```bash
# Register Static Web Apps provider
az provider register --namespace Microsoft.Web

# Check registration status
az provider show --namespace Microsoft.Web --query "registrationState"
```

### "GitHub authentication failed"
```bash
# Re-authenticate with GitHub
az staticwebapp create ... --login-with-github

# Or manually set GitHub token
az staticwebapp create ... --token {GITHUB_TOKEN}
```

---

## Environment Variables (Optional)

### Set for Session
```bash
export AZURE_SUBSCRIPTION_ID="2f3b1816-d09d-41c5-bf19-110614b6d94c"
export AZURE_RESOURCE_GROUP="rg-ut-assistant-fc"
export AZURE_LOCATION="francecentral"

# Use in commands
az group create --name $AZURE_RESOURCE_GROUP --location $AZURE_LOCATION
```

### Persist in Shell Config (~/.bashrc or ~/.zshrc)
```bash
echo 'export AZURE_SUBSCRIPTION_ID="2f3b1816-d09d-41c5-bf19-110614b6d94c"' >> ~/.bashrc
source ~/.bashrc
```

---

## Quick Reference Card

| Task | Command |
|------|---------|
| Login | `az login` |
| Show account | `az account show` |
| Create RG | `az group create --name rg-ut-assistant-fc --location francecentral` |
| Create SWA | `az staticwebapp create --name ut-assistant-app --resource-group rg-ut-assistant-fc --source {GITHUB_URL} --location francecentral --branch main --app-location "/src" --login-with-github` |
| Get SWA URL | `az staticwebapp show --name ut-assistant-app --resource-group rg-ut-assistant-fc --query "defaultHostname" -o tsv` |
| Create App Reg | `az ad app create --display-name "UT-Finance-Assistant-SSO" --sign-in-audience AzureADMyOrg` |
| Create Secret | `az ad app credential reset --id {APP_ID} --append --years 2` |
| Delete RG | `az group delete --name rg-ut-assistant-fc --yes` |

---

## Documentation Links

- [Azure CLI Reference](https://learn.microsoft.com/en-us/cli/azure/)
- [Static Web Apps CLI](https://learn.microsoft.com/en-us/cli/azure/staticwebapp)
- [Entra ID CLI](https://learn.microsoft.com/en-us/cli/azure/ad/app)

---

**Last Updated**: 2026-01-07
**Azure CLI Version**: 2.x
