
#!/bin/bash

# Create zip file of the application
echo "Creating Azure AD Manager zip archive..."
zip -r azure-ad-manager.zip public src index.html package.json tailwind.config.ts tsconfig.json vite.config.ts README.md

echo "Archive created: azure-ad-manager.zip"
echo "You can download this file to get a copy of the application."

