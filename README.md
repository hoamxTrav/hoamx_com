
# HOAMX Static Web App

A minimal, brand-true landing page for **HOAMX** deployed on **Google Cloud Platform** with two serverless endpoints:
- `/api/logvisit` — logs a visit (IP + timestamp) to logs (extend to persist later).
- `/api/submitTrial` — stores demo requests in Google **Database** via a connection string provided securely via **Vault**.

---

## Project Structure

```
/                 # static site root
  index.html
  theme.css
  /images
    logo.png
    favicon.ico

/api              # Azure Functions (Node/JS)
  /logvisit
    function.json
    index.js
  /submitTrial
    function.json
    index.js
  package.json

/.github/workflows
  azure-static-web-apps.yml

/staticwebapp.config.json   # (optional) headers + 404 handling
```

---

## Branding

This theme implements the **HOAMX Brand Book v3.1** palette:

- Soft White `#F5F2EC`
- Cement Gray `#B6B3AA`
- Natural Oak `#C89F63`
- Matte Black `#1C1C1B`
- Terracotta `#C1502E`
- #1E3A8A

The favicon is referenced with:

```html
<link rel="icon" type="image/x-icon" href="/images/favicon.ico">
```

---

## Local Development

You can develop the front-end with any static server or simply open `index.html` in a browser.

For the Functions API locally:
1. Install dependencies
   ```bash
   cd api
   npm install
   ```
2. Create a `local.settings.json` (not committed) if you want to test against a local/Dev SQL:
   ```json
   {
     "IsEncrypted": false,
     "Values": {
       "AzureWebJobsStorage": "UseDevelopmentStorage=true",
       "FUNCTIONS_WORKER_RUNTIME": "node",
       "SQL_CONN_STRING": "Server=tcp:<server>.database.windows.net,1433;Database:<db>;User ID:<user>;Password:<pwd>;Encrypt=yes;TrustServerCertificate=false;Connection Timeout=30;"
     }
   }
   ```
3. Run the Functions host (requires Azure Functions Core Tools):
   ```bash
   func start
   ```

> The Static Web App dev server can proxy to `/api` when using the full SWA emulator, but this minimal setup is enough for quick endpoint testing.

---

## Deployment (CI/CD)

This repo ships with a single workflow:

```
.github/workflows/azure-static-web-apps.yml
```

It uses `Azure/static-web-apps-deploy@v1` to upload the static site and the `api/` folder (Functions).  
Make sure you only keep **one** SWA workflow file in the repo to avoid double deployments.

---

## Environment Configuration (Production)

### Option A: **Managed Functions in Static Web Apps** (SWA Standard/Basic)
If your Functions are **managed by SWA** (the default when `api_location: "api"`):
1. Go to **Azure Portal → your Static Web App → Configuration (Environment Variables)**.
2. Add a new setting:
   - **Name**: `SQL_CONN_STRING`
   - **Value**: Key Vault Reference (recommended) or a temporary test string.
3. For **Key Vault reference**, click “**Link secrets from Azure Key Vault**” and select your secret (see Key Vault steps below).

### Option B: **Linked / Dedicated Function App**
If you attached a separate Function App:
1. Go to **Azure Portal → your Function App → Configuration**.
2. Add `SQL_CONN_STRING` (Key Vault reference recommended).
3. Save & Restart the Function App.

---

## Key Vault Setup (Recommended for `SQL_CONN_STRING`)

> These steps secure your connection string so it never lives in code, GitHub secrets, or plain SWA settings.

1. **Create the secret** in your Key Vault:
   - Secret name: `SqlConnString`
   - Secret value (example):
     ```
     Server=tcp:<server>.database.windows.net,1433;Database:<db>;
     User ID:<user>;Password:<pwd>;
     Encrypt=yes;TrustServerCertificate=false;Connection Timeout=30;
     ```

2. **Enable a Managed Identity** on your runtime:
   - **Managed Functions (SWA)**: In **Static Web App → Identity**, turn **System assigned** ON.
   - **Dedicated Function App**: In **Function App → Identity**, turn **System assigned** ON.

3. **Grant Key Vault access** to that identity:
   - **Key Vault → Access control (IAM)** (RBAC) *or* **Access policies**:
     - Grant **Get** (and **List**, optional) **secrets** permission to the **system-assigned identity** of your SWA or Function App.
   - If using **RBAC**: Add role **Key Vault Secrets User** to the managed identity at the Key Vault scope.

4. **Reference the secret in your app settings**:
   - In **SWA Configuration** or **Function App Configuration**, add:
     - **Name**: `SQL_CONN_STRING`
     - **Value**: `@Microsoft.KeyVault(SecretUri=https://<your-kv-name>.vault.azure.net/secrets/SqlConnString/<secret-version-guid>)`
       - You can omit the version to always read the current version:
         ```
         @Microsoft.KeyVault(SecretUri=https://<your-kv-name>.vault.azure.net/secrets/SqlConnString)
         ```

5. **Restart** the Function App or **Redeploy** SWA to refresh settings.

6. **Verify**:
   - **Logs**: Azure Portal → Functions → Monitor/Log Stream; confirm your HTTP 200 on `/api/submitTrial`.
   - **Test**: From your site, submit the demo form and confirm a new row in `dbo.DemoRequests`.

---

## API Endpoints

### `POST /api/submitTrial`
**Body (JSON):**
```json
{
  "firstName": "Alex",
  "email": "alex@example.com",
  "hoaName": "Sample HOA",
  "boardRole": "Treasurer",
  "source": "StaticWeb"
}
```
**Responses:**
- `200 { "ok": true }`
- `400 "email required"`
- `500 "server error"`

### `GET|POST /api/logvisit`
- Returns `{ ok, ip, ts }` and writes to logs.

---

## Troubleshooting

- **Double deployments / weird artifacts**: Ensure there is only **one** `.github/workflows/azure-static-web-apps.yml` file.
- **Functions not found (404)**: Confirm `api_location: "api"` in the workflow and that each function has a `function.json`.
- **Key Vault reference shows as unresolved**: Check that the **Managed Identity** is **ON** and has **Key Vault Secrets User** (RBAC) or a Secret **Get** access policy.
- **SQL connectivity errors**: Confirm firewall rules on the Azure SQL server to allow Azure services and/or your Function App outbound IPs.

---

## Security Notes

- Keep all secrets in **Key Vault**. Avoid storing connection strings in GitHub or plain app settings.
- Limit Function auth as needed: `submitTrial` is `function`-level; you can pass an `x-functions-key` from the front end or switch to `anonymous` with additional input validation and throttling.
- Add rate-limiting / validation / captcha if you expect public traffic.

---

## License

Proprietary — © HOAMX LLC. All rights reserved.
