import fs from "fs";
import path from "path";

export function initCommand() {
  const dotEnvFile = path.join(process.cwd(), ".env") 
  if (!fs.existsSync(dotEnvFile)) {
    console.log("Generating an empty .env to help you get started.")
    fs.writeFileSync(
      dotEnvFile,
      `
## Register as a developer at Planning Center.
#
# For security, you need your own developer account key here:
# https://api.planningcenteronline.com/oauth/applications
# 
# Create a "Personal Access Token" (PAT) on the 2nd section. This will come in the form of an application ID and a secret.

PCO_APPLICATION_ID=[application id]
PCO_SECRET=[secret]
`
    );
  }
}
