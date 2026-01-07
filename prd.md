# Product Requirements Document

## Project Name: UT-Assistant Front Door

### Executive Summary
Static Azure web app serving as a front door to multiple Understand Tech AI assistants. Authentication and authorization are fully delegated to Understand Tech's SSO platform (Microsoft Entra ID), enforcing team-based RBAC without requiring any backend infrastructure.

---

## Implementation Phases

### Phase 1 (MVP) – Azure Static Web App + Assistant Links
**Status**: PLANNED

Create a minimal static site (home page) that lists assistants and redirects users to their Understand Tech assistant URLs. Deploy via Azure Static Web Apps with GitHub Actions for automated deployment from IDE/CLI.

**Deliverables**:
- Landing page with assistant cards (Finance Team, Growth Team)
- Config-driven assistant list (JSON)
- Azure Static Web App deployment
- GitHub Actions CI/CD pipeline

**Success Criteria**:
- Site accessible at Azure URL
- Assistant buttons correctly redirect to UT URLs with api_key & model_id parameters
- Responsive design (mobile-friendly)

---

### Phase 2 – Understand Tech SSO Validation
**Status**: PLANNED

Configure Microsoft Entra ID app registrations in Demo_SSO tenant and link to Understand Tech teams via SSO configuration. Validate SSO authentication flow.

**Deliverables**:
- Entra ID app registrations (Finance Team, Growth Team)
- UT team SSO configuration (Client ID, Client Secret, Tenant ID)
- SSO enabled on UT assistants

**Success Criteria**:
- Demo_SSO users successfully authenticate via Microsoft login
- Non-tenant users are denied access
- No additional login required on static site (auth handled by UT)

---

### Phase 3 – Basic Hardening
**Status**: PLANNED

Add production-ready security configurations, error handling, and optional custom domain.

**Deliverables**:
- Security headers (CSP, X-Frame-Options, etc.)
- HTTPS enforcement
- Error pages (404, 500)
- Environment configuration (dev/prod)
- Optional: Custom domain

---

### Phase 4 (Future) – SharePoint Integration
**Status**: FUTURE CONSIDERATION

Migrate front door to SharePoint for additional organizational access controls. UT assistant routing remains unchanged.

**Considerations**:
- SharePoint site permissions as additional access layer
- Azure Static Web App as fallback/dev environment
- Documentation for SharePoint deployment

## Azure Target

Subscription: Microsoft Azure Sponsorship (Subscription ID: 2f3b1816-d09d-41c5-bf19-110614b6d94c)
Current directory: WISEKEY (wisekey.com)
Target directory: Demo_SSO tenant (Tenant ID: 9398883c-8dd9-4fd9-b410-e42de5143116)
Region for MVP resources: France Central

## Step 0 (Pre-step) – Associate subscription to Demo_SSO tenant  (optionnal)

Use “Change directory” on the subscription to associate it to the Demo_SSO Entra tenant, then re-create RBAC role assignments in the target directory (Owner at minimum).

---

## Technical Architecture

### Authentication Flow
```
User → Azure Static Web App (Unauthenticated)
  ↓
  Click "Launch Finance Assistant"
  ↓
  Redirect to: https://app.understand.tech/?api_key={key}&model_id={model}
  ↓
Understand Tech SSO Check
  ↓
Microsoft Entra ID Login (Demo_SSO Tenant)
  ↓
[If authorized] → Finance Assistant Chat Interface
[If unauthorized] → Access Denied
```

### Key Architectural Decisions
1. **Zero backend**: Pure static site, no API or server-side code
2. **Zero authentication on static site**: All auth delegated to Understand Tech
3. **RBAC enforcement**: Microsoft Entra ID tenant membership + UT team assignment
4. **API key exposure**: Acceptable (SSO is the security control, not api_key alone)
5. **Deployment**: GitHub Actions → Azure Static Web Apps (automated)

---

## Open Decisions

### Critical Decisions Required:
1. **GitHub Repository**
   - [ ] Organization or personal account?
   - [ ] Repository name: `ut-assistant-app`?
   - [ ] Public or private repo?

2. **Resource Naming**
   - [ ] Resource Group: `rg-ut-assistant-fc` (recommended)
   - [ ] Static Web App: `ut-assistant-app` (recommended)
   - [ ] Region: France Central (confirmed)

3. **Subscription Association**
   - [ ] Keep subscription in WISEKEY tenant (easier, current state)
   - [ ] OR transfer to Demo_SSO tenant (requires RBAC reconfiguration)
   - **Recommendation**: Keep in WISEKEY for MVP, transfer later if needed

4. **Entra ID App Registrations**
   - [ ] Separate app per team (Finance, Growth) - **RECOMMENDED for RBAC isolation**
   - [ ] OR single shared app registration
   - **Recommendation**: Separate apps for cleaner RBAC and audit trails

5. **Custom Domain**
   - [ ] Use Azure-generated URL for MVP (`https://{name}.azurestaticapps.net`)
   - [ ] OR configure custom domain immediately
   - **Recommendation**: Azure URL for MVP, custom domain in Phase 3

### Questions for Understand Tech Support:
- [ ] Confirm SSO feature enabled for Demo_SSO tenant (Tenant ID: 9398883c-8dd9-4fd9-b410-e42de5143116)
- [ ] Clarify Widget API Key usage (required for iframe embedding?)
- [ ] Best practices for client-side api_key exposure in production

---

## Assistant Configuration

### Finance Team Assistant
- **URL**: `https://app.understand.tech/?api_key=af74821d2bdebde0a0a10642cd2a426fe637b0c7cfe9feae5b14cc33e61c7b00&model_id=Finance%20team`
- **API Key**: `af74821d2bdebde0a0a10642cd2a426fe637b0c7cfe9feae5b14cc33e61c7b00`
- **Model ID**: `Finance team`
- **Team**: Finance
- **Tenant**: Demo_SSO (9398883c-8dd9-4fd9-b410-e42de5143116)

### Growth Team Assistant
- **URL**: `https://app.understand.tech/?api_key=d100b2d15d44173658505082589d00ca5977ef33abb895590871d786a5c110e3&model_id=Growth%20Team`
- **API Key**: `d100b2d15d44173658505082589d00ca5977ef33abb895590871d786a5c110e3`
- **Model ID**: `Growth Team`
- **Team**: Growth
- **Tenant**: Demo_SSO (9398883c-8dd9-4fd9-b410-e42de5143116)

### Iframe Embedding (Optional)
```html
<!-- Finance Team -->
<iframe
  src="https://app.understand.tech/?api_key=af74821d2bdebde0a0a10642cd2a426fe637b0c7cfe9feae5b14cc33e61c7b00&model_id=Finance%20team"
  width="100%"
  height="600px"
  title="Finance Team Assistant">
</iframe>

<!-- Growth Team -->
<iframe
  src="https://app.understand.tech/?api_key=d100b2d15d44173658505082589d00ca5977ef33abb895590871d786a5c110e3&model_id=Growth%20Team"
  width="100%"
  height="600px"
  title="Growth Team Assistant">
</iframe>
```

**Note**: Iframe embedding requires Widget API Key from UT SSO configuration and may have cross-origin cookie complications. MVP will use direct links (new tab/window) instead.

---

## Next Steps

See [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) for detailed execution plan.

**Immediate Actions**:
1. Review and approve this PRD
2. Make decisions on open items (GitHub repo, resource naming)
3. Verify Azure subscription access
4. Contact UT support to confirm SSO enablement
5. Proceed to Phase 0 (Prerequisites) in implementation plan