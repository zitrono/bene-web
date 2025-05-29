// Google Apps Script - Form Handler
// Deploy this as a Web App to handle form submissions

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const formType = data.formType;
    
    // Get or create the spreadsheet
    const spreadsheetId = getOrCreateSpreadsheet();
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    
    let sheet;
    let emailSubject;
    let emailBody;
    
    switch(formType) {
      case 'demo':
        sheet = spreadsheet.getSheetByName('Demo Requests') || 
                spreadsheet.insertSheet('Demo Requests');
        emailSubject = 'New Ralph Demo Request';
        emailBody = formatDemoEmail(data);
        break;
        
      case 'newsletter':
        sheet = spreadsheet.getSheetByName('Newsletter Signups') || 
                spreadsheet.insertSheet('Newsletter Signups');
        emailSubject = 'New Ralph Newsletter Signup';
        emailBody = formatNewsletterEmail(data);
        break;
        
      case 'meeting':
        sheet = spreadsheet.getSheetByName('SuperReturn Meetings') || 
                spreadsheet.insertSheet('SuperReturn Meetings');
        emailSubject = 'New SuperReturn Meeting Request';
        emailBody = formatMeetingEmail(data);
        break;
    }
    
    // Add headers if first row
    if (sheet.getLastRow() === 0) {
      addHeaders(sheet, formType);
    }
    
    // Add data
    const timestamp = new Date();
    const rowData = formatRowData(data, formType, timestamp);
    sheet.appendRow(rowData);
    
    // Send email notification
    sendEmailNotification(emailSubject, emailBody);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        'status': 'success',
        'message': 'Form submitted successfully'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        'status': 'error',
        'message': error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getOrCreateSpreadsheet() {
  // Replace with your spreadsheet ID or create new one
  const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
  
  try {
    SpreadsheetApp.openById(SPREADSHEET_ID);
    return SPREADSHEET_ID;
  } catch (e) {
    // Create new spreadsheet
    const newSpreadsheet = SpreadsheetApp.create('Ralph Form Submissions');
    return newSpreadsheet.getId();
  }
}

function addHeaders(sheet, formType) {
  const headers = {
    'demo': ['Timestamp', 'Name', 'Company', 'Email', 'Phone', 'AUM', 'Deals', 'Message'],
    'newsletter': ['Timestamp', 'Email', 'Consent'],
    'meeting': ['Timestamp', 'Name', 'Company', 'Email', 'Phone', 'Times', 'Focus']
  };
  
  sheet.getRange(1, 1, 1, headers[formType].length).setValues([headers[formType]]);
  sheet.getRange(1, 1, 1, headers[formType].length).setFontWeight('bold');
}

function formatRowData(data, formType, timestamp) {
  switch(formType) {
    case 'demo':
      return [
        timestamp,
        data.name || '',
        data.company || '',
        data.email || '',
        data.phone || '',
        data.aum || '',
        data.deals || '',
        data.message || ''
      ];
      
    case 'newsletter':
      return [
        timestamp,
        data.email || '',
        data.consent ? 'Yes' : 'No'
      ];
      
    case 'meeting':
      return [
        timestamp,
        data.name || '',
        data.company || '',
        data.email || '',
        data.phone || '',
        (data.times || []).join(', '),
        data.focus || ''
      ];
  }
}

function formatDemoEmail(data) {
  return `
New demo request received:

Name: ${data.name}
Company: ${data.company}
Email: ${data.email}
Phone: ${data.phone || 'Not provided'}
Assets Under Management: ${data.aum || 'Not specified'}
Deals Evaluated Annually: ${data.deals || 'Not specified'}

Message:
${data.message || 'No specific message'}

---
Respond promptly to schedule the demo.
  `;
}

function formatNewsletterEmail(data) {
  return `
New newsletter signup:

Email: ${data.email}
Consent: ${data.consent ? 'Yes' : 'No'}

---
Add to mailing list.
  `;
}

function formatMeetingEmail(data) {
  return `
New SuperReturn meeting request:

Name: ${data.name}
Company: ${data.company}
Email: ${data.email}
Phone: ${data.phone || 'Not provided'}

Preferred Times:
${(data.times || []).join('\n')}

Meeting Focus:
${data.focus || 'Not specified'}

---
Confirm meeting slot ASAP.
  `;
}

function sendEmailNotification(subject, body) {
  const EMAIL_TO = 'contact@beneficious.com'; // Change to your email
  
  try {
    MailApp.sendEmail({
      to: EMAIL_TO,
      subject: subject,
      body: body
    });
  } catch (e) {
    console.error('Failed to send email:', e);
  }
}

// Test function
function testDoPost() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        formType: 'demo',
        name: 'Test User',
        company: 'Test Company',
        email: 'test@example.com'
      })
    }
  };
  
  const result = doPost(testData);
  console.log(result.getContent());
}
