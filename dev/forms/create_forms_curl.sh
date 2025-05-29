#!/bin/bash
# Create Google Forms for Ralph/Beneficious using direct API calls

# Get access token
TOKEN=$(gcloud auth application-default print-access-token)

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "Creating Google Forms for Ralph/Beneficious..."
echo "============================================================"

# 1. Create Demo Request Form
echo -e "\n${GREEN}Creating Demo Request Form...${NC}"
DEMO_FORM=$(curl -s -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "info": {
      "title": "Ralph - Private Beta Demo Request",
      "documentTitle": "Ralph Demo Request Form"
    }
  }' \
  https://forms.googleapis.com/v1/forms)

DEMO_FORM_ID=$(echo $DEMO_FORM | grep -o '"formId":"[^"]*' | sed 's/"formId":"//')

if [ -z "$DEMO_FORM_ID" ]; then
  echo -e "${RED}Failed to create Demo Request Form${NC}"
  echo $DEMO_FORM
else
  echo -e "${GREEN}✓ Created Demo Request Form: https://docs.google.com/forms/d/$DEMO_FORM_ID${NC}"
  
  # Add questions to demo form
  curl -s -X POST \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "requests": [
        {
          "updateFormInfo": {
            "info": {
              "description": "Schedule a personalized demo to see how Ralph can transform your due diligence process."
            },
            "updateMask": "description"
          }
        },
        {
          "createItem": {
            "item": {
              "title": "Name",
              "questionItem": {
                "question": {
                  "required": true,
                  "textQuestion": {"paragraph": false}
                }
              }
            },
            "location": {"index": 0}
          }
        },
        {
          "createItem": {
            "item": {
              "title": "Company",
              "questionItem": {
                "question": {
                  "required": true,
                  "textQuestion": {"paragraph": false}
                }
              }
            },
            "location": {"index": 1}
          }
        },
        {
          "createItem": {
            "item": {
              "title": "Email",
              "questionItem": {
                "question": {
                  "required": true,
                  "textQuestion": {"paragraph": false}
                }
              }
            },
            "location": {"index": 2}
          }
        },
        {
          "createItem": {
            "item": {
              "title": "Assets Under Management",
              "questionItem": {
                "question": {
                  "required": false,
                  "choiceQuestion": {
                    "type": "DROPDOWN",
                    "options": [
                      {"value": "Under €100M"},
                      {"value": "€100M - €500M"},
                      {"value": "€500M - €1B"},
                      {"value": "€1B - €5B"},
                      {"value": "€5B+"}
                    ]
                  }
                }
              }
            },
            "location": {"index": 3}
          }
        }
      ]
    }' \
    https://forms.googleapis.com/v1/forms/$DEMO_FORM_ID:batchUpdate > /dev/null
fi

# 2. Create Newsletter Form
echo -e "\n${GREEN}Creating Newsletter Form...${NC}"
NEWSLETTER_FORM=$(curl -s -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "info": {
      "title": "Ralph - Newsletter Signup",
      "documentTitle": "Ralph Newsletter",
      "description": "Get the latest updates on Ralph and AI-native private equity operations."
    }
  }' \
  https://forms.googleapis.com/v1/forms)

NEWSLETTER_FORM_ID=$(echo $NEWSLETTER_FORM | grep -o '"formId":"[^"]*' | sed 's/"formId":"//')

if [ -z "$NEWSLETTER_FORM_ID" ]; then
  echo -e "${RED}Failed to create Newsletter Form${NC}"
else
  echo -e "${GREEN}✓ Created Newsletter Form: https://docs.google.com/forms/d/$NEWSLETTER_FORM_ID${NC}"
fi

# 3. Create SuperReturn Meeting Form
echo -e "\n${GREEN}Creating SuperReturn Meeting Form...${NC}"
MEETING_FORM=$(curl -s -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "info": {
      "title": "Schedule Meeting at SuperReturn Berlin 2025",
      "documentTitle": "SuperReturn Meeting Request"
    }
  }' \
  https://forms.googleapis.com/v1/forms)

MEETING_FORM_ID=$(echo $MEETING_FORM | grep -o '"formId":"[^"]*' | sed 's/"formId":"//')

if [ -z "$MEETING_FORM_ID" ]; then
  echo -e "${RED}Failed to create SuperReturn Meeting Form${NC}"
else
  echo -e "${GREEN}✓ Created SuperReturn Meeting Form: https://docs.google.com/forms/d/$MEETING_FORM_ID${NC}"
fi

# Save form IDs to configuration file
echo -e "\n${GREEN}Saving form configuration...${NC}"
cat > forms_config.json <<EOF
{
  "demo_request": {
    "form_id": "$DEMO_FORM_ID",
    "embed_url": "https://docs.google.com/forms/d/e/$DEMO_FORM_ID/viewform?embedded=true",
    "direct_url": "https://docs.google.com/forms/d/$DEMO_FORM_ID/viewform"
  },
  "newsletter": {
    "form_id": "$NEWSLETTER_FORM_ID",
    "embed_url": "https://docs.google.com/forms/d/e/$NEWSLETTER_FORM_ID/viewform?embedded=true",
    "direct_url": "https://docs.google.com/forms/d/$NEWSLETTER_FORM_ID/viewform"
  },
  "superreturn_meeting": {
    "form_id": "$MEETING_FORM_ID",
    "embed_url": "https://docs.google.com/forms/d/e/$MEETING_FORM_ID/viewform?embedded=true",
    "direct_url": "https://docs.google.com/forms/d/$MEETING_FORM_ID/viewform"
  }
}
EOF

echo -e "\n============================================================"
echo -e "${GREEN}✅ Forms created successfully!${NC}"
echo -e "\nForm URLs saved to: forms_config.json"
echo -e "\nNext steps:"
echo "1. Visit each form URL to complete setup"
echo "2. Set up form notifications (Settings > Responses > Get email notifications)"
echo "3. Link responses to Google Sheets for analysis"
echo "4. Update your website to use these forms"
