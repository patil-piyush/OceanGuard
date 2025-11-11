# services/email_service.py
import os
from models.authority_model import AuthorityModel
# For production use an email provider like SendGrid, SES, etc.
# Here we provide a placeholder that prints and can be extended.

def notify_authorities(lat, lng, report_type, image_url, predicted_path, radius_km=10):
    authorities = AuthorityModel.get_nearby_authorities(lat, lng, radius_km)
    emails_sent = []
    for a in authorities:
        to = a.get("email")
        subject = f"New {report_type.replace('_', ' ').title()} reported nearby"
        body = f"""
New report at ({lat}, {lng})
Type: {report_type}
Image: {image_url}
Predicted path: {predicted_path}
Please login to OceanGuard to accept the request.
"""
        # Replace this with real email sending code
        print(f"[Email] To: {to}\nSubject: {subject}\n{body}")
        emails_sent.append(to)
    return emails_sent
