#!/usr/bin/env python3
"""
CivilCalc Pro Backend API Test Suite
Tests all backend endpoints through the Next.js catch-all route at /app/app/api/[[...path]]/route.js
"""

import requests
import json
import time
import os
from datetime import datetime

# Read base URL from .env
def get_base_url():
    env_path = '/app/.env'
    with open(env_path, 'r') as f:
        for line in f:
            if line.startswith('NEXT_PUBLIC_BASE_URL='):
                return line.split('=', 1)[1].strip()
    return 'http://localhost:3000'

BASE_URL = get_base_url() + '/api'
print(f"Testing against: {BASE_URL}")

# Test state
test_results = {
    'passed': 0,
    'failed': 0,
    'tests': []
}

# Global test user credentials
TEST_USER = {
    'name': 'Test Engineer',
    'email': f'test+{int(time.time())}@civilcalc.in',
    'password': 'Pass@1234',
    'token': None,
    'userId': None
}

def log_test(name, passed, details=''):
    """Log test result"""
    status = '✅ PASS' if passed else '❌ FAIL'
    print(f"{status}: {name}")
    if details:
        print(f"  Details: {details}")
    
    test_results['tests'].append({
        'name': name,
        'passed': passed,
        'details': details
    })
    
    if passed:
        test_results['passed'] += 1
    else:
        test_results['failed'] += 1

def test_auth_signup():
    """Test POST /api/auth/signup"""
    try:
        response = requests.post(
            f"{BASE_URL}/auth/signup",
            json={
                'name': TEST_USER['name'],
                'email': TEST_USER['email'],
                'password': TEST_USER['password']
            },
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if 'token' in data and 'user' in data:
                TEST_USER['token'] = data['token']
                TEST_USER['userId'] = data['user']['userId']
                log_test('Auth Signup', True, f"User created: {data['user']['email']}, plan: {data['user']['plan']}")
                return True
            else:
                log_test('Auth Signup', False, f"Missing token or user in response: {data}")
                return False
        else:
            log_test('Auth Signup', False, f"Status {response.status_code}: {response.text}")
            return False
    except Exception as e:
        log_test('Auth Signup', False, f"Exception: {str(e)}")
        return False

def test_auth_signup_duplicate():
    """Test POST /api/auth/signup with duplicate email"""
    try:
        response = requests.post(
            f"{BASE_URL}/auth/signup",
            json={
                'name': TEST_USER['name'],
                'email': TEST_USER['email'],  # Same email
                'password': TEST_USER['password']
            },
            timeout=10
        )
        
        if response.status_code == 400:
            data = response.json()
            if 'error' in data:
                log_test('Auth Signup Duplicate Email', True, f"Correctly rejected: {data['error']}")
                return True
            else:
                log_test('Auth Signup Duplicate Email', False, "400 but no error message")
                return False
        else:
            log_test('Auth Signup Duplicate Email', False, f"Expected 400, got {response.status_code}")
            return False
    except Exception as e:
        log_test('Auth Signup Duplicate Email', False, f"Exception: {str(e)}")
        return False

def test_auth_login():
    """Test POST /api/auth/login"""
    try:
        response = requests.post(
            f"{BASE_URL}/auth/login",
            json={
                'email': TEST_USER['email'],
                'password': TEST_USER['password']
            },
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if 'token' in data and 'user' in data:
                log_test('Auth Login', True, f"Login successful for {data['user']['email']}")
                return True
            else:
                log_test('Auth Login', False, f"Missing token or user: {data}")
                return False
        else:
            log_test('Auth Login', False, f"Status {response.status_code}: {response.text}")
            return False
    except Exception as e:
        log_test('Auth Login', False, f"Exception: {str(e)}")
        return False

def test_auth_login_wrong_password():
    """Test POST /api/auth/login with wrong password"""
    try:
        response = requests.post(
            f"{BASE_URL}/auth/login",
            json={
                'email': TEST_USER['email'],
                'password': 'WrongPassword123!'
            },
            timeout=10
        )
        
        if response.status_code == 401:
            log_test('Auth Login Wrong Password', True, "Correctly rejected invalid credentials")
            return True
        else:
            log_test('Auth Login Wrong Password', False, f"Expected 401, got {response.status_code}")
            return False
    except Exception as e:
        log_test('Auth Login Wrong Password', False, f"Exception: {str(e)}")
        return False

def test_auth_me():
    """Test GET /api/auth/me"""
    try:
        headers = {'Authorization': f'Bearer {TEST_USER["token"]}'}
        response = requests.get(f"{BASE_URL}/auth/me", headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if 'userId' in data and 'email' in data and 'plan' in data:
                log_test('Auth Me', True, f"User: {data['email']}, plan: {data['plan']}")
                return True
            else:
                log_test('Auth Me', False, f"Missing fields in response: {data}")
                return False
        else:
            log_test('Auth Me', False, f"Status {response.status_code}: {response.text}")
            return False
    except Exception as e:
        log_test('Auth Me', False, f"Exception: {str(e)}")
        return False

def test_auth_me_unauthorized():
    """Test GET /api/auth/me without token"""
    try:
        response = requests.get(f"{BASE_URL}/auth/me", timeout=10)
        
        if response.status_code == 401:
            log_test('Auth Me Unauthorized', True, "Correctly rejected request without token")
            return True
        else:
            log_test('Auth Me Unauthorized', False, f"Expected 401, got {response.status_code}")
            return False
    except Exception as e:
        log_test('Auth Me Unauthorized', False, f"Exception: {str(e)}")
        return False

def test_calculate_beam():
    """Test POST /api/calculate/beam"""
    try:
        headers = {'Authorization': f'Bearer {TEST_USER["token"]}'}
        response = requests.post(
            f"{BASE_URL}/calculate/beam",
            headers=headers,
            json={
                'span': 5,
                'width': 230,
                'depth': 450,
                'deadLoad': 5,
                'liveLoad': 10,
                'grade': 'M25',
                'steelGrade': 'Fe500'
            },
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if 'result' in data and 'isDesignSafe' in data['result']:
                result = data['result']
                has_required = all(k in result for k in ['design', 'loads', 'moment', 'steel', 'shear'])
                if has_required:
                    log_test('Calculate Beam', True, f"Design safe: {result['isDesignSafe']}, calculationId: {data.get('calculationId')}")
                    return True
                else:
                    log_test('Calculate Beam', False, f"Missing nested objects in result: {list(result.keys())}")
                    return False
            else:
                log_test('Calculate Beam', False, f"Missing result or isDesignSafe: {data}")
                return False
        else:
            log_test('Calculate Beam', False, f"Status {response.status_code}: {response.text}")
            return False
    except Exception as e:
        log_test('Calculate Beam', False, f"Exception: {str(e)}")
        return False

def test_calculate_slab():
    """Test POST /api/calculate/slab"""
    try:
        headers = {'Authorization': f'Bearer {TEST_USER["token"]}'}
        response = requests.post(
            f"{BASE_URL}/calculate/slab",
            headers=headers,
            json={
                'length': 4,
                'width': 3,
                'liveLoad': 3,
                'floorFinish': 1,
                'grade': 'M20',
                'steelGrade': 'Fe415'
            },
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if 'result' in data and 'calculationId' in data:
                log_test('Calculate Slab', True, f"Slab calculation completed, calculationId: {data['calculationId']}")
                return True
            else:
                log_test('Calculate Slab', False, f"Missing result or calculationId: {data}")
                return False
        else:
            log_test('Calculate Slab', False, f"Status {response.status_code}: {response.text}")
            return False
    except Exception as e:
        log_test('Calculate Slab', False, f"Exception: {str(e)}")
        return False

def test_calculate_column():
    """Test POST /api/calculate/column"""
    try:
        headers = {'Authorization': f'Bearer {TEST_USER["token"]}'}
        response = requests.post(
            f"{BASE_URL}/calculate/column",
            headers=headers,
            json={
                'width': 300,
                'depth': 300,
                'height': 3,
                'axialLoad': 600,
                'grade': 'M25',
                'steelGrade': 'Fe500'
            },
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if 'result' in data and 'calculationId' in data:
                log_test('Calculate Column', True, f"Column calculation completed, calculationId: {data['calculationId']}")
                return True
            else:
                log_test('Calculate Column', False, f"Missing result or calculationId: {data}")
                return False
        else:
            log_test('Calculate Column', False, f"Status {response.status_code}: {response.text}")
            return False
    except Exception as e:
        log_test('Calculate Column', False, f"Exception: {str(e)}")
        return False

def test_calculate_concrete_volume():
    """Test POST /api/calculate/concrete-volume"""
    try:
        headers = {'Authorization': f'Bearer {TEST_USER["token"]}'}
        response = requests.post(
            f"{BASE_URL}/calculate/concrete-volume",
            headers=headers,
            json={
                'length': 5000,
                'width': 3000,
                'thickness': 150
            },
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if 'result' in data:
                result = data['result']
                has_required = all(k in result for k in ['wetVolume', 'dryVolume', 'cement', 'sand', 'aggregate'])
                if has_required:
                    log_test('Calculate Concrete Volume', True, f"Wet volume: {result['wetVolume']} m³")
                    return True
                else:
                    log_test('Calculate Concrete Volume', False, f"Missing required fields: {list(result.keys())}")
                    return False
            else:
                log_test('Calculate Concrete Volume', False, f"Missing result: {data}")
                return False
        else:
            log_test('Calculate Concrete Volume', False, f"Status {response.status_code}: {response.text}")
            return False
    except Exception as e:
        log_test('Calculate Concrete Volume', False, f"Exception: {str(e)}")
        return False

def test_calculate_steel_weight():
    """Test POST /api/calculate/steel-weight"""
    try:
        headers = {'Authorization': f'Bearer {TEST_USER["token"]}'}
        response = requests.post(
            f"{BASE_URL}/calculate/steel-weight",
            headers=headers,
            json={
                'diameter': 20,
                'length': 12
            },
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if 'result' in data and 'calculationId' in data:
                log_test('Calculate Steel Weight', True, f"Steel weight calculated, calculationId: {data['calculationId']}")
                return True
            else:
                log_test('Calculate Steel Weight', False, f"Missing result or calculationId: {data}")
                return False
        else:
            log_test('Calculate Steel Weight', False, f"Status {response.status_code}: {response.text}")
            return False
    except Exception as e:
        log_test('Calculate Steel Weight', False, f"Exception: {str(e)}")
        return False

def test_dashboard_stats():
    """Test GET /api/dashboard/stats"""
    try:
        headers = {'Authorization': f'Bearer {TEST_USER["token"]}'}
        response = requests.get(f"{BASE_URL}/dashboard/stats", headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if all(k in data for k in ['projectCount', 'calculationCount', 'recentProjects']):
                log_test('Dashboard Stats', True, f"Projects: {data['projectCount']}, Calculations: {data['calculationCount']}")
                return True
            else:
                log_test('Dashboard Stats', False, f"Missing required fields: {list(data.keys())}")
                return False
        else:
            log_test('Dashboard Stats', False, f"Status {response.status_code}: {response.text}")
            return False
    except Exception as e:
        log_test('Dashboard Stats', False, f"Exception: {str(e)}")
        return False

def test_calculations_list():
    """Test GET /api/calculations"""
    try:
        headers = {'Authorization': f'Bearer {TEST_USER["token"]}'}
        response = requests.get(f"{BASE_URL}/calculations", headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if 'calculations' in data and isinstance(data['calculations'], list):
                log_test('Calculations List', True, f"Retrieved {len(data['calculations'])} calculations")
                return True
            else:
                log_test('Calculations List', False, f"Missing or invalid calculations array: {data}")
                return False
        else:
            log_test('Calculations List', False, f"Status {response.status_code}: {response.text}")
            return False
    except Exception as e:
        log_test('Calculations List', False, f"Exception: {str(e)}")
        return False

def test_projects_list():
    """Test GET /api/projects"""
    try:
        headers = {'Authorization': f'Bearer {TEST_USER["token"]}'}
        response = requests.get(f"{BASE_URL}/projects", headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if 'projects' in data and isinstance(data['projects'], list):
                log_test('Projects List', True, f"Retrieved {len(data['projects'])} projects")
                return True
            else:
                log_test('Projects List', False, f"Missing or invalid projects array: {data}")
                return False
        else:
            log_test('Projects List', False, f"Status {response.status_code}: {response.text}")
            return False
    except Exception as e:
        log_test('Projects List', False, f"Exception: {str(e)}")
        return False

def test_create_project():
    """Test POST /api/projects"""
    try:
        headers = {'Authorization': f'Bearer {TEST_USER["token"]}'}
        response = requests.post(
            f"{BASE_URL}/projects",
            headers=headers,
            json={
                'name': 'Pilot Project',
                'description': 'Test project for backend validation',
                'type': 'rcc'
            },
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if 'projectId' in data:
                log_test('Create Project', True, f"Project created: {data['projectId']}")
                return True
            else:
                log_test('Create Project', False, f"Missing projectId: {data}")
                return False
        else:
            log_test('Create Project', False, f"Status {response.status_code}: {response.text}")
            return False
    except Exception as e:
        log_test('Create Project', False, f"Exception: {str(e)}")
        return False

# AI Chat tests
AI_SESSION_ID = None

def test_ai_chat_new_session():
    """Test POST /api/ai/chat (new session)"""
    global AI_SESSION_ID
    try:
        headers = {'Authorization': f'Bearer {TEST_USER["token"]}'}
        response = requests.post(
            f"{BASE_URL}/ai/chat",
            headers=headers,
            json={
                'message': 'Explain IS 456 clause 26.5.1'
            },
            timeout=30  # AI calls may take longer
        )
        
        if response.status_code == 200:
            data = response.json()
            if all(k in data for k in ['sessionId', 'reply', 'source']):
                AI_SESSION_ID = data['sessionId']
                source = data['source']
                source_info = f"source: {source} ({'REAL Claude via Emergent' if source == 'claude' else 'MOCK fallback'})"
                log_test('AI Chat New Session', True, f"Session created: {AI_SESSION_ID}, {source_info}")
                return True
            else:
                log_test('AI Chat New Session', False, f"Missing required fields: {list(data.keys())}")
                return False
        else:
            log_test('AI Chat New Session', False, f"Status {response.status_code}: {response.text}")
            return False
    except Exception as e:
        log_test('AI Chat New Session', False, f"Exception: {str(e)}")
        return False

def test_ai_chat_existing_session():
    """Test POST /api/ai/chat (existing session)"""
    try:
        headers = {'Authorization': f'Bearer {TEST_USER["token"]}'}
        response = requests.post(
            f"{BASE_URL}/ai/chat",
            headers=headers,
            json={
                'sessionId': AI_SESSION_ID,
                'message': 'And clause 23.2.1?'
            },
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get('sessionId') == AI_SESSION_ID and 'reply' in data and 'source' in data:
                source = data['source']
                log_test('AI Chat Existing Session', True, f"Same session: {AI_SESSION_ID}, source: {source}")
                return True
            else:
                log_test('AI Chat Existing Session', False, f"Session mismatch or missing fields: {data}")
                return False
        else:
            log_test('AI Chat Existing Session', False, f"Status {response.status_code}: {response.text}")
            return False
    except Exception as e:
        log_test('AI Chat Existing Session', False, f"Exception: {str(e)}")
        return False

def test_ai_sessions_list():
    """Test GET /api/ai/sessions"""
    try:
        headers = {'Authorization': f'Bearer {TEST_USER["token"]}'}
        response = requests.get(f"{BASE_URL}/ai/sessions", headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if 'sessions' in data and isinstance(data['sessions'], list):
                # Check that our session is in the list
                session_ids = [s.get('sessionId') for s in data['sessions']]
                if AI_SESSION_ID in session_ids:
                    # Verify messages are NOT projected (should not be in list view)
                    has_messages = any('messages' in s for s in data['sessions'])
                    if not has_messages:
                        log_test('AI Sessions List', True, f"Retrieved {len(data['sessions'])} sessions (without messages)")
                        return True
                    else:
                        log_test('AI Sessions List', False, "Sessions list should not include messages field")
                        return False
                else:
                    log_test('AI Sessions List', False, f"Created session {AI_SESSION_ID} not found in list")
                    return False
            else:
                log_test('AI Sessions List', False, f"Missing or invalid sessions array: {data}")
                return False
        else:
            log_test('AI Sessions List', False, f"Status {response.status_code}: {response.text}")
            return False
    except Exception as e:
        log_test('AI Sessions List', False, f"Exception: {str(e)}")
        return False

def test_ai_session_get():
    """Test GET /api/ai/sessions/{sessionId}"""
    try:
        headers = {'Authorization': f'Bearer {TEST_USER["token"]}'}
        response = requests.get(f"{BASE_URL}/ai/sessions/{AI_SESSION_ID}", headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if 'session' in data:
                session = data['session']
                if 'messages' in session and isinstance(session['messages'], list):
                    # Should have at least 4 messages (2 user + 2 assistant from our 2 chat calls)
                    if len(session['messages']) >= 4:
                        log_test('AI Session Get', True, f"Session retrieved with {len(session['messages'])} messages")
                        return True
                    else:
                        log_test('AI Session Get', False, f"Expected at least 4 messages, got {len(session['messages'])}")
                        return False
                else:
                    log_test('AI Session Get', False, "Session should include messages array")
                    return False
            else:
                log_test('AI Session Get', False, f"Missing session: {data}")
                return False
        else:
            log_test('AI Session Get', False, f"Status {response.status_code}: {response.text}")
            return False
    except Exception as e:
        log_test('AI Session Get', False, f"Exception: {str(e)}")
        return False

def test_ai_session_delete():
    """Test DELETE /api/ai/sessions/{sessionId}"""
    try:
        headers = {'Authorization': f'Bearer {TEST_USER["token"]}'}
        response = requests.delete(f"{BASE_URL}/ai/sessions/{AI_SESSION_ID}", headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if 'deleted' in data and data['deleted'] == 1:
                log_test('AI Session Delete', True, f"Session {AI_SESSION_ID} deleted")
                return True
            else:
                log_test('AI Session Delete', False, f"Unexpected response: {data}")
                return False
        else:
            log_test('AI Session Delete', False, f"Status {response.status_code}: {response.text}")
            return False
    except Exception as e:
        log_test('AI Session Delete', False, f"Exception: {str(e)}")
        return False

def test_ai_session_get_after_delete():
    """Test GET /api/ai/sessions/{sessionId} after deletion (should 404)"""
    try:
        headers = {'Authorization': f'Bearer {TEST_USER["token"]}'}
        response = requests.get(f"{BASE_URL}/ai/sessions/{AI_SESSION_ID}", headers=headers, timeout=10)
        
        if response.status_code == 404:
            log_test('AI Session Get After Delete', True, "Correctly returned 404 for deleted session")
            return True
        else:
            log_test('AI Session Get After Delete', False, f"Expected 404, got {response.status_code}")
            return False
    except Exception as e:
        log_test('AI Session Get After Delete', False, f"Exception: {str(e)}")
        return False

# Payment tests
PAYMENT_ORDER_ID = None

def test_payments_create_order():
    """Test POST /api/payments/create-order (MOCKED)"""
    global PAYMENT_ORDER_ID
    try:
        headers = {'Authorization': f'Bearer {TEST_USER["token"]}'}
        response = requests.post(
            f"{BASE_URL}/payments/create-order",
            headers=headers,
            json={
                'planId': 'pro',
                'billing': 'monthly',
                'amount': 499
            },
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            required = ['orderId', 'key', 'amount', 'currency', 'mocked']
            if all(k in data for k in required):
                if data['currency'] == 'INR' and data['mocked'] == True:
                    PAYMENT_ORDER_ID = data['orderId']
                    log_test('Payments Create Order', True, f"Order created: {PAYMENT_ORDER_ID}, MOCKED: {data['mocked']}")
                    return True
                else:
                    log_test('Payments Create Order', False, f"Currency or mocked flag incorrect: {data}")
                    return False
            else:
                log_test('Payments Create Order', False, f"Missing required fields: {list(data.keys())}")
                return False
        else:
            log_test('Payments Create Order', False, f"Status {response.status_code}: {response.text}")
            return False
    except Exception as e:
        log_test('Payments Create Order', False, f"Exception: {str(e)}")
        return False

def test_payments_verify():
    """Test POST /api/payments/verify (MOCKED)"""
    try:
        headers = {'Authorization': f'Bearer {TEST_USER["token"]}'}
        response = requests.post(
            f"{BASE_URL}/payments/verify",
            headers=headers,
            json={
                'orderId': PAYMENT_ORDER_ID,
                'paymentId': 'pay_mock_xyz',
                'planId': 'pro'
            },
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success') == True and data.get('plan') == 'pro' and data.get('mocked') == True:
                log_test('Payments Verify', True, f"Payment verified, plan upgraded to: {data['plan']}, MOCKED: {data['mocked']}")
                return True
            else:
                log_test('Payments Verify', False, f"Unexpected response: {data}")
                return False
        else:
            log_test('Payments Verify', False, f"Status {response.status_code}: {response.text}")
            return False
    except Exception as e:
        log_test('Payments Verify', False, f"Exception: {str(e)}")
        return False

def test_auth_me_after_payment():
    """Test GET /api/auth/me after payment (should show plan: 'pro')"""
    try:
        headers = {'Authorization': f'Bearer {TEST_USER["token"]}'}
        response = requests.get(f"{BASE_URL}/auth/me", headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get('plan') == 'pro':
                log_test('Auth Me After Payment', True, f"User plan updated to: {data['plan']}")
                return True
            else:
                log_test('Auth Me After Payment', False, f"Expected plan 'pro', got: {data.get('plan')}")
                return False
        else:
            log_test('Auth Me After Payment', False, f"Status {response.status_code}: {response.text}")
            return False
    except Exception as e:
        log_test('Auth Me After Payment', False, f"Exception: {str(e)}")
        return False

def print_summary():
    """Print test summary"""
    print("\n" + "="*80)
    print("TEST SUMMARY")
    print("="*80)
    print(f"Total Tests: {test_results['passed'] + test_results['failed']}")
    print(f"✅ Passed: {test_results['passed']}")
    print(f"❌ Failed: {test_results['failed']}")
    print("="*80)
    
    if test_results['failed'] > 0:
        print("\nFailed Tests:")
        for test in test_results['tests']:
            if not test['passed']:
                print(f"  ❌ {test['name']}: {test['details']}")
    
    print("\n")

def main():
    """Run all tests in sequence"""
    print("="*80)
    print("CivilCalc Pro Backend API Test Suite")
    print("="*80)
    print(f"Base URL: {BASE_URL}")
    print(f"Test User: {TEST_USER['email']}")
    print("="*80 + "\n")
    
    # Auth tests
    print("🔐 Testing Authentication...")
    if not test_auth_signup():
        print("⚠️  Signup failed, cannot continue with other tests")
        print_summary()
        return
    
    test_auth_signup_duplicate()
    test_auth_login()
    test_auth_login_wrong_password()
    test_auth_me()
    test_auth_me_unauthorized()
    
    # Calculator tests
    print("\n🧮 Testing RCC Calculators...")
    test_calculate_beam()
    test_calculate_slab()
    test_calculate_column()
    test_calculate_concrete_volume()
    test_calculate_steel_weight()
    
    # Dashboard tests
    print("\n📊 Testing Dashboard & Projects...")
    test_dashboard_stats()
    test_calculations_list()
    test_projects_list()
    test_create_project()
    
    # AI tests
    print("\n🤖 Testing AI Assistant...")
    if test_ai_chat_new_session():
        test_ai_chat_existing_session()
        test_ai_sessions_list()
        test_ai_session_get()
        test_ai_session_delete()
        test_ai_session_get_after_delete()
    else:
        print("⚠️  AI chat new session failed, skipping related tests")
    
    # Payment tests
    print("\n💳 Testing Payments (MOCKED)...")
    if test_payments_create_order():
        test_payments_verify()
        test_auth_me_after_payment()
    else:
        print("⚠️  Payment order creation failed, skipping verify test")
    
    print_summary()

if __name__ == '__main__':
    main()
