import os
import requests
from dotenv import load_dotenv
from uuid import uuid4
load_dotenv()

CHAPA_SECRET_KEY = os.getenv("CHAPA_SECRET_KEY")
CHAPA_PUBLIC_KEY = os.getenv("CHAPA_PUBLIC_KEY")
CHAPA_WEBHOOK_URL = os.getenv("CHAPA_WEBHOOK_URL")
CHAPA_CALLBACK_URL = os.getenv("CHAPA_CALLBACK_URL")

CHAPA_BASE_URL = "https://api.chapa.co/v1"

def initialize_payment(email, amount, first_name, last_name, tx_ref, custom_data=None):
    url = f"{CHAPA_BASE_URL}/transaction/initialize"
    headers = {
        "Authorization": f"Bearer {CHAPA_SECRET_KEY}",
        "Content-Type": "application/json",
    }


    # Dynamically append tx_ref to return_url
    return_url_with_tx = f"{CHAPA_CALLBACK_URL}?trx_ref={tx_ref}"

    payload = {
        "amount": str(amount),
        "currency": "ETB",
        "email": email,
        "first_name": first_name,
        "last_name": last_name,
        "tx_ref": tx_ref,
        "callback_url": CHAPA_CALLBACK_URL,
        "return_url": return_url_with_tx,
        "customization": {
            "title": "Natna Equb",
            "description": "Equb contribution payment via Chapa",
        },
        "meta": custom_data or {},
    }

    response = requests.post(url, headers=headers, json=payload, timeout=10)
    return response.json()




def initialize_withdrawal(account_name, account_number, bank_code, amount, reference=None, custom_data=None):
    """
    Initiate a withdrawal using Chapa Transfer API
    """
    url = "https://api.chapa.co/v1/transfers"

    payload = {
        "account_name": account_name,
        "account_number": str(account_number),  # must be numeric string
        "bank_code": str(bank_code),           # must be numeric string
        "amount": str(amount),
        "currency": "ETB",
        "reference": reference or f"WDL-{uuid4().hex[:10]}",
        "meta": custom_data or {},
    }

    headers = {
        "Authorization": f"Bearer {CHAPA_SECRET_KEY}",
        "Content-Type": "application/json",
    }

    response = requests.post(url, json=payload, headers=headers, timeout=10)
    return response.json()




def verify_payment(tx_ref):
    url = f"{CHAPA_BASE_URL}/transaction/verify/{tx_ref}"
    headers = {"Authorization": f"Bearer {CHAPA_SECRET_KEY}"}
    response = requests.get(url, headers=headers, timeout=10)
    return response.json()
