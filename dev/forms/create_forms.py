#!/usr/bin/env python3
"""
Create Google Forms for Ralph/Beneficious
Autonomous Data Room Intelligence for Private Equity
"""

from google.auth import default
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import json

# Authenticate using Application Default Credentials
credentials, project = default(scopes=['https://www.googleapis.com/auth/forms.body'])
service = build('forms', 'v1', credentials=credentials)

def create_demo_request_form():
    """Create the main demo request form for private beta access"""
    
    form_body = {
        "info": {
            "title": "Ralph - Private Beta Demo Request",
            "documentTitle": "Ralph Demo Request Form"
        }
    }
    
    # Create the form
    form = service.forms().create(body=form_body).execute()
    form_id = form['formId']
    print(f"Created Demo Request Form: https://docs.google.com/forms/d/{form_id}")
    
    # Update with questions
    update_body = {
        "requests": [
            # Add description
            {
                "updateFormInfo": {
                    "info": {
                        "description": "Schedule a personalized demo to see how Ralph can transform your due diligence process. We're currently partnering with select private equity firms for our private beta program."
                    },
                    "updateMask": "description"
                }
            },
            # Name field
            {
                "createItem": {
                    "item": {
                        "title": "Name",
                        "questionItem": {
                            "question": {
                                "required": True,
                                "textQuestion": {
                                    "paragraph": False
                                }
                            }
                        }
                    },
                    "location": {"index": 0}
                }
            },
            # Company field
            {
                "createItem": {
                    "item": {
                        "title": "Company",
                        "questionItem": {
                            "question": {
                                "required": True,
                                "textQuestion": {
                                    "paragraph": False
                                }
                            }
                        }
                    },
                    "location": {"index": 1}
                }
            },
            # Email field
            {
                "createItem": {
                    "item": {
                        "title": "Email",
                        "questionItem": {
                            "question": {
                                "required": True,
                                "textQuestion": {
                                    "paragraph": False
                                }
                            }
                        }
                    },
                    "location": {"index": 2}
                }
            },
            # Phone field
            {
                "createItem": {
                    "item": {
                        "title": "Phone",
                        "questionItem": {
                            "question": {
                                "required": False,
                                "textQuestion": {
                                    "paragraph": False
                                }
                            }
                        }
                    },
                    "location": {"index": 3}
                }
            },
            # Assets Under Management
            {
                "createItem": {
                    "item": {
                        "title": "Assets Under Management",
                        "questionItem": {
                            "question": {
                                "required": False,
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
                    "location": {"index": 4}
                }
            },
            # Deals Evaluated Annually
            {
                "createItem": {
                    "item": {
                        "title": "Deals Evaluated Annually",
                        "questionItem": {
                            "question": {
                                "required": False,
                                "choiceQuestion": {
                                    "type": "DROPDOWN",
                                    "options": [
                                        {"value": "1-10"},
                                        {"value": "11-25"},
                                        {"value": "26-50"},
                                        {"value": "50+"}
                                    ]
                                }
                            }
                        }
                    },
                    "location": {"index": 5}
                }
            },
            # Specific Interest Areas
            {
                "createItem": {
                    "item": {
                        "title": "Specific Interest Areas",
                        "description": "Tell us about your current due diligence challenges or specific use cases",
                        "questionItem": {
                            "question": {
                                "required": False,
                                "textQuestion": {
                                    "paragraph": True
                                }
                            }
                        }
                    },
                    "location": {"index": 6}
                }
            }
        ]
    }
    
    # Execute the update
    service.forms().batchUpdate(formId=form_id, body=update_body).execute()
    
    return form_id

def create_newsletter_form():
    """Create newsletter signup form"""
    
    form_body = {
        "info": {
            "title": "Ralph - Newsletter Signup",
            "documentTitle": "Ralph Newsletter",
            "description": "Get the latest updates on Ralph and the future of AI-native private equity operations."
        }
    }
    
    # Create the form
    form = service.forms().create(body=form_body).execute()
    form_id = form['formId']
    print(f"Created Newsletter Form: https://docs.google.com/forms/d/{form_id}")
    
    # Update with questions
    update_body = {
        "requests": [
            # Email field
            {
                "createItem": {
                    "item": {
                        "title": "Email Address",
                        "questionItem": {
                            "question": {
                                "required": True,
                                "textQuestion": {
                                    "paragraph": False
                                }
                            }
                        }
                    },
                    "location": {"index": 0}
                }
            },
            # Consent checkbox
            {
                "createItem": {
                    "item": {
                        "title": "Consent",
                        "questionItem": {
                            "question": {
                                "required": True,
                                "choiceQuestion": {
                                    "type": "CHECKBOX",
                                    "options": [
                                        {"value": "I consent to receiving communications about Ralph and Beneficious products"}
                                    ]
                                }
                            }
                        }
                    },
                    "location": {"index": 1}
                }
            }
        ]
    }
    
    service.forms().batchUpdate(formId=form_id, body=update_body).execute()
    
    return form_id

def create_superreturn_meeting_form():
    """Create SuperReturn meeting scheduler form"""
    
    form_body = {
        "info": {
            "title": "Schedule Meeting at SuperReturn Berlin 2025",
            "documentTitle": "SuperReturn Meeting Request",
            "description": "Schedule a meeting with our team at SuperReturn International 2025 in Berlin to see Ralph in action and discuss how autonomous intelligence can transform your due diligence process."
        }
    }
    
    # Create the form
    form = service.forms().create(body=form_body).execute()
    form_id = form['formId']
    print(f"Created SuperReturn Meeting Form: https://docs.google.com/forms/d/{form_id}")
    
    # Update with questions
    update_body = {
        "requests": [
            # Name
            {
                "createItem": {
                    "item": {
                        "title": "Name",
                        "questionItem": {
                            "question": {
                                "required": True,
                                "textQuestion": {
                                    "paragraph": False
                                }
                            }
                        }
                    },
                    "location": {"index": 0}
                }
            },
            # Company
            {
                "createItem": {
                    "item": {
                        "title": "Company",
                        "questionItem": {
                            "question": {
                                "required": True,
                                "textQuestion": {
                                    "paragraph": False
                                }
                            }
                        }
                    },
                    "location": {"index": 1}
                }
            },
            # Email
            {
                "createItem": {
                    "item": {
                        "title": "Email",
                        "questionItem": {
                            "question": {
                                "required": True,
                                "textQuestion": {
                                    "paragraph": False
                                }
                            }
                        }
                    },
                    "location": {"index": 2}
                }
            },
            # Phone
            {
                "createItem": {
                    "item": {
                        "title": "Phone",
                        "questionItem": {
                            "question": {
                                "required": False,
                                "textQuestion": {
                                    "paragraph": False
                                }
                            }
                        }
                    },
                    "location": {"index": 3}
                }
            },
            # Preferred Meeting Times
            {
                "createItem": {
                    "item": {
                        "title": "Preferred Meeting Times",
                        "description": "Please select your preferred time slots",
                        "questionItem": {
                            "question": {
                                "required": True,
                                "choiceQuestion": {
                                    "type": "CHECKBOX",
                                    "options": [
                                        {"value": "Monday Morning"},
                                        {"value": "Monday Afternoon"},
                                        {"value": "Tuesday Morning"},
                                        {"value": "Tuesday Afternoon"},
                                        {"value": "Wednesday Morning"},
                                        {"value": "Wednesday Afternoon"}
                                    ]
                                }
                            }
                        }
                    },
                    "location": {"index": 4}
                }
            },
            # Meeting Focus
            {
                "createItem": {
                    "item": {
                        "title": "Meeting Focus",
                        "description": "What would you like to discuss?",
                        "questionItem": {
                            "question": {
                                "required": False,
                                "textQuestion": {
                                    "paragraph": True
                                }
                            }
                        }
                    },
                    "location": {"index": 5}
                }
            }
        ]
    }
    
    service.forms().batchUpdate(formId=form_id, body=update_body).execute()
    
    return form_id

def main():
    """Create all forms and save their IDs"""
    
    print("Creating Google Forms for Ralph/Beneficious...")
    print("=" * 60)
    
    try:
        # Create all forms
        demo_form_id = create_demo_request_form()
        newsletter_form_id = create_newsletter_form()
        superreturn_form_id = create_superreturn_meeting_form()
        
        # Save form IDs for integration
        forms_config = {
            "demo_request": {
                "form_id": demo_form_id,
                "embed_url": f"https://docs.google.com/forms/d/e/{demo_form_id}/viewform?embedded=true",
                "direct_url": f"https://docs.google.com/forms/d/{demo_form_id}/viewform"
            },
            "newsletter": {
                "form_id": newsletter_form_id,
                "embed_url": f"https://docs.google.com/forms/d/e/{newsletter_form_id}/viewform?embedded=true",
                "direct_url": f"https://docs.google.com/forms/d/{newsletter_form_id}/viewform"
            },
            "superreturn_meeting": {
                "form_id": superreturn_form_id,
                "embed_url": f"https://docs.google.com/forms/d/e/{superreturn_form_id}/viewform?embedded=true",
                "direct_url": f"https://docs.google.com/forms/d/{superreturn_form_id}/viewform"
            }
        }
        
        # Save configuration
        with open('/Users/zitrono/dev/web/bene/forms_config.json', 'w') as f:
            json.dump(forms_config, f, indent=2)
        
        print("\n" + "=" * 60)
        print("✅ All forms created successfully!")
        print("\nForm URLs saved to: forms_config.json")
        print("\nNext steps:")
        print("1. Share forms with respondents")
        print("2. Set up form notifications (Settings > Responses > Get email notifications)")
        print("3. Link responses to Google Sheets for analysis")
        print("4. Integrate with your website using the embed URLs")
        
    except HttpError as error:
        print(f"An error occurred: {error}")
        return None

if __name__ == "__main__":
    main()
