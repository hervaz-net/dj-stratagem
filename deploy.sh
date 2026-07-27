#!/bin/bash

# D&J Stratagem Deployment Script
# This script helps deploy the dist/ folder to various hosting platforms

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== D&J Stratagem Deployment Tool ===${NC}\n"

# Check if dist folder exists
if [ ! -d "dist" ]; then
    echo -e "${YELLOW}dist/ folder not found. Building...${NC}"
    npm run build
fi

echo -e "${GREEN}dist/ folder is ready for deployment${NC}\n"

# Show menu
echo "Choose deployment method:"
echo "1) Namecheap Shared Hosting (FTP)"
echo "2) Remote Server (SSH/SCP)"
echo "3) Show deployment instructions only"
echo ""
read -p "Enter choice (1-3): " choice

case $choice in
    1)
        echo -e "\n${BLUE}Namecheap FTP Deployment${NC}"
        echo "----------------------------------------"
        echo "Manual steps:"
        echo "1. Open FileZilla or your FTP client"
        echo "2. Connect with credentials from Namecheap welcome email"
        echo "3. Navigate to public_html/ (or subdomain folder)"
        echo "4. Upload all files from dist/ (not the folder itself)"
        echo ""
        echo "Contents to upload from dist/:"
        ls -la dist/
        ;;
    2)
        echo -e "\n${BLUE}Remote Server SSH/SCP Deployment${NC}"
        echo "----------------------------------------"
        read -p "Enter SSH host (user@hostname): " host
        read -p "Enter remote path (e.g., /var/www/html): " remote_path
        
        echo -e "\n${YELLOW}Deploying to ${host}:${remote_path}${NC}"
        scp -r dist/* "$host:$remote_path/"
        echo -e "${GREEN}✓ Deployment complete!${NC}"
        ;;
    3)
        echo -e "\n${BLUE}Deployment Instructions${NC}"
        echo "----------------------------------------"
        echo ""
        echo "📁 Contents of dist/ folder:"
        ls -la dist/
        echo ""
        echo "Upload all these files to your server's public root directory."
        echo ""
        echo "Common deployment targets:"
        echo "• Namecheap: public_html/ (via cPanel File Manager or FTP)"
        echo "• AWS S3: Use AWS CLI (aws s3 sync dist/ s3://bucket-name/)"
        echo "• Vercel: npx vercel --prod"
        echo "• Netlify: Drop dist/ into Netlify UI"
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac

echo -e "\n${GREEN}Done!${NC}"
