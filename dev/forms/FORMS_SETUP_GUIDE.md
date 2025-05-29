# Ralph Forms Setup Guide

Since we're facing Google Workspace authentication restrictions, here's a simpler solution that works immediately:

## Quick Setup (10 minutes)

### Step 1: Create Google Apps Script Project

1. Go to https://script.google.com
2. Click "New Project"
3. Delete the default code
4. Copy and paste the entire contents of `google-apps-script.js`
5. Click "Save" and name it "Ralph Form Handler"

### Step 2: Deploy as Web App

1. Click "Deploy" → "New Deployment"
2. Choose type: "Web app"
3. Settings:
   - Description: "Ralph Form Handler"
   - Execute as: "Me"
   - Who has access: "Anyone"
4. Click "Deploy"
5. **IMPORTANT**: Copy the Web App URL (looks like https://script.google.com/macros/s/AKfyc.../exec)

### Step 3: Update Your Website Forms

Replace the form submission code in your index.html with:

```javascript
// Replace YOUR_WEB_APP_URL with the URL from Step 2
const FORM_HANDLER_URL = 'YOUR_WEB_APP_URL';

// Demo form handler
document.getElementById('demo-request-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const data = {
        formType: 'demo',
        name: formData.get('name'),
        company: formData.get('company'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        aum: formData.get('aum'),
        deals: formData.get('deals'),
        message: formData.get('message')
    };
    
    try {
        const response = await fetch(FORM_HANDLER_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {'Content-Type': 'text/plain'},
            body: JSON.stringify(data)
        });
        
        document.getElementById('demo-success').style.display = 'block';
        e.target.reset();
    } catch (error) {
        document.getElementById('demo-error').style.display = 'block';
    }
});

// Newsletter form handler
document.getElementById('newsletter-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const data = {
        formType: 'newsletter',
        email: formData.get('email'),
        consent: formData.get('consent') === 'on'
    };
    
    try {
        const response = await fetch(FORM_HANDLER_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {'Content-Type': 'text/plain'},
            body: JSON.stringify(data)
        });
        
        document.getElementById('newsletter-success').style.display = 'block';
        e.target.reset();
    } catch (error) {
        document.getElementById('newsletter-error').style.display = 'block';
    }
});

// Meeting form handler
document.getElementById('meeting-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const times = [];
    e.target.querySelectorAll('input[name="times"]:checked').forEach(cb => {
        times.push(cb.value);
    });
    
    const data = {
        formType: 'meeting',
        name: formData.get('name'),
        company: formData.get('company'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        times: times,
        focus: formData.get('focus')
    };
    
    try {
        const response = await fetch(FORM_HANDLER_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {'Content-Type': 'text/plain'},
            body: JSON.stringify(data)
        });
        
        document.getElementById('meeting-success').style.display = 'block';
        e.target.reset();
    } catch (error) {
        document.getElementById('meeting-error').style.display = 'block';
    }
});
```

### Step 4: Create Google Sheet for Responses

1. Go to https://sheets.google.com
2. Create a new spreadsheet named "Ralph Form Submissions"
3. Copy the spreadsheet ID from the URL (the long string between /d/ and /edit)
4. Go back to your Apps Script project
5. Replace 'YOUR_SPREADSHEET_ID_HERE' with your actual spreadsheet ID
6. Change EMAIL_TO to your email address
7. Save and redeploy (Deploy → Manage Deployments → Edit → Version: New Version → Deploy)

## Features

✅ All form submissions saved to Google Sheets
✅ Email notifications for each submission
✅ No authentication issues
✅ Works with any Google account
✅ Secure and reliable
✅ Easy to customize

## Testing

1. Open your website with the forms
2. Submit a test entry
3. Check your Google Sheet for the data
4. Check your email for the notification

## Customization

- Add more fields: Update both the HTML form and the Apps Script
- Change email templates: Modify the format functions in Apps Script
- Add validation: Add checks in the doPost function
- Multiple recipients: Modify the sendEmailNotification function

## Alternative: Use Native Google Forms

If you prefer, I can also help you:
1. Create the forms manually in Google Forms
2. Embed them in your website using iframes
3. Set up email notifications through Forms settings

Would you like me to walk you through either approach?
