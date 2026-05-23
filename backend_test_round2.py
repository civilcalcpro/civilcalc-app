#!/usr/bin/env python3
"""
CivilCalc Pro Backend API Test Suite - Round 2
Tests NEW backend endpoints added in Round 2
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

# Admin credentials (already seeded)
ADMIN_USER = {
    'email': 'admin@civilcalc.in',
    'password': 'Admin@1234',
    'token': None,
    'userId': None
}

# Test user credentials (will be created)
TEST_USER = {
    'name': 'Test Engineer Round2',
    'email': f'nonadmin+{int(time.time())}@cc.in',
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

def test_admin_login():
    """Test admin login and verify role"""
    try:
        response = requests.post(
            f"{BASE_URL}/auth/login",
            json={
                'email': ADMIN_USER['email'],
                'password': ADMIN_USER['password']
            },
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if 'token' in data and 'user' in data:
                ADMIN_USER['token'] = data['token']
                ADMIN_USER['userId'] = data['user']['userId']
                user_role = data['user'].get('role')
                if user_role == 'admin':
                    log_test('Admin Login - role check', True, f"Admin logged in, role: {user_role}")
                    return True
                else:
                    log_test('Admin Login - role check', False, f"Expected role 'admin', got: {user_role}")
                    return False
            else:
                log_test('Admin Login - role check', False, f"Missing token or user in response")
                return False
        else:
            log_test('Admin Login - role check', False, f"Status {response.status_code}: {response.text}")
            return False
    except Exception as e:
        log_test('Admin Login - role check', False, f"Exception: {str(e)}")
        return False

def test_user_signup():
    """Test user signup and verify role"""
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
                user_role = data['user'].get('role')
                if user_role == 'user':
                    log_test('User Signup - role check', True, f"User created, role: {user_role}")
                    return True
                else:
                    log_test('User Signup - role check', False, f"Expected role 'user', got: {user_role}")
                    return False
            else:
                log_test('User Signup - role check', False, f"Missing token or user in response")
                return False
        else:
            log_test('User Signup - role check', False, f"Status {response.status_code}: {response.text}")
            return False
    except Exception as e:
        log_test('User Signup - role check', False, f"Exception: {str(e)}")
        return False

def test_update_profile_success():
    """Test POST /api/auth/update-profile with valid data"""
    try:
        headers = {'Authorization': f'Bearer {TEST_USER["token"]}'}
        new_name = 'Updated Engineer Name'
        new_email = f'updated+{int(time.time())}@cc.in'
        
        response = requests.post(
            f"{BASE_URL}/auth/update-profile",
            headers=headers,
            json={
                'name': new_name,
                'email': new_email
            },
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success') == True:
                # Update TEST_USER email for future tests
                TEST_USER['email'] = new_email
                log_test('Update Profile - success', True, f"Profile updated to {new_email}")
                return True
            else:
                log_test('Update Profile - success', False, f"Expected success: true, got: {data}")
                return False
        else:
            log_test('Update Profile - success', False, f"Status {response.status_code}: {response.text}")
            return False
    except Exception as e:
        log_test('Update Profile - success', False, f"Exception: {str(e)}")
        return False

def test_update_profile_no_auth():
    """Test POST /api/auth/update-profile without auth"""
    try:
        response = requests.post(
            f"{BASE_URL}/auth/update-profile",
            json={
                'name': 'Test',
                'email': 'test@test.com'
            },
            timeout=10
        )
        
        if response.status_code == 401:
            log_test('Update Profile - no auth', True, "Correctly rejected without auth")
            return True
        else:
            log_test('Update Profile - no auth', False, f"Expected 401, got {response.status_code}")
            return False
    except Exception as e:
        log_test('Update Profile - no auth', False, f"Exception: {str(e)}")
        return False

def test_update_profile_missing_fields():
    """Test POST /api/auth/update-profile with missing fields"""
    try:
        headers = {'Authorization': f'Bearer {TEST_USER["token"]}'}
        response = requests.post(
            f"{BASE_URL}/auth/update-profile",
            headers=headers,
            json={
                'name': 'Only Name'
                # Missing email
            },
            timeout=10
        )
        
        if response.status_code == 400:
            log_test('Update Profile - missing fields', True, "Correctly rejected missing email")
            return True
        else:
            log_test('Update Profile - missing fields', False, f"Expected 400, got {response.status_code}")
            return False
    except Exception as e:
        log_test('Update Profile - missing fields', False, f"Exception: {str(e)}")
        return False

def test_update_profile_email_taken():
    """Test POST /api/auth/update-profile with email already taken by another user"""
    try:
        headers = {'Authorization': f'Bearer {TEST_USER["token"]}'}
        # Try to use admin's email
        response = requests.post(
            f"{BASE_URL}/auth/update-profile",
            headers=headers,
            json={
                'name': 'Test',
                'email': ADMIN_USER['email']  # Admin's email
            },
            timeout=10
        )
        
        if response.status_code == 400:
            data = response.json()
            error_msg = data.get('error', '')
            if 'already in use' in error_msg.lower():
                log_test('Update Profile - email taken', True, f"Correctly rejected: {error_msg}")
                return True
            else:
                log_test('Update Profile - email taken', False, f"Got 400 but wrong error: {error_msg}")
                return False
        else:
            log_test('Update Profile - email taken', False, f"Expected 400, got {response.status_code}")
            return False
    except Exception as e:
        log_test('Update Profile - email taken', False, f"Exception: {str(e)}")
        return False

def test_change_password_success():
    """Test POST /api/auth/change-password with correct current password"""
    try:
        headers = {'Authorization': f'Bearer {TEST_USER["token"]}'}
        new_password = 'NewPass@1234'
        
        response = requests.post(
            f"{BASE_URL}/auth/change-password",
            headers=headers,
            json={
                'currentPassword': TEST_USER['password'],
                'newPassword': new_password
            },
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success') == True:
                # Update password for future tests
                TEST_USER['password'] = new_password
                log_test('Change Password - success', True, "Password changed successfully")
                return True
            else:
                log_test('Change Password - success', False, f"Expected success: true, got: {data}")
                return False
        else:
            log_test('Change Password - success', False, f"Status {response.status_code}: {response.text}")
            return False
    except Exception as e:
        log_test('Change Password - success', False, f"Exception: {str(e)}")
        return False

def test_login_with_new_password():
    """Test login with new password after password change"""
    try:
        response = requests.post(
            f"{BASE_URL}/auth/login",
            json={
                'email': TEST_USER['email'],
                'password': TEST_USER['password']  # New password
            },
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if 'token' in data:
                # Update token
                TEST_USER['token'] = data['token']
                log_test('Login with new password', True, "Login successful with new password")
                return True
            else:
                log_test('Login with new password', False, "Missing token in response")
                return False
        else:
            log_test('Login with new password', False, f"Status {response.status_code}: {response.text}")
            return False
    except Exception as e:
        log_test('Login with new password', False, f"Exception: {str(e)}")
        return False

def test_login_with_old_password():
    """Test login with old password (should fail)"""
    try:
        response = requests.post(
            f"{BASE_URL}/auth/login",
            json={
                'email': TEST_USER['email'],
                'password': 'Pass@1234'  # Old password
            },
            timeout=10
        )
        
        if response.status_code == 401:
            log_test('Login with old password', True, "Correctly rejected old password")
            return True
        else:
            log_test('Login with old password', False, f"Expected 401, got {response.status_code}")
            return False
    except Exception as e:
        log_test('Login with old password', False, f"Exception: {str(e)}")
        return False

def test_change_password_wrong_current():
    """Test POST /api/auth/change-password with wrong current password"""
    try:
        headers = {'Authorization': f'Bearer {TEST_USER["token"]}'}
        response = requests.post(
            f"{BASE_URL}/auth/change-password",
            headers=headers,
            json={
                'currentPassword': 'WrongPassword123!',
                'newPassword': 'AnotherPass@1234'
            },
            timeout=10
        )
        
        if response.status_code == 401:
            data = response.json()
            error_msg = data.get('error', '')
            if 'incorrect' in error_msg.lower():
                log_test('Change Password - wrong current', True, f"Correctly rejected: {error_msg}")
                return True
            else:
                log_test('Change Password - wrong current', False, f"Got 401 but wrong error: {error_msg}")
                return False
        else:
            log_test('Change Password - wrong current', False, f"Expected 401, got {response.status_code}")
            return False
    except Exception as e:
        log_test('Change Password - wrong current', False, f"Exception: {str(e)}")
        return False

def test_change_password_short_new():
    """Test POST /api/auth/change-password with new password < 6 chars"""
    try:
        headers = {'Authorization': f'Bearer {TEST_USER["token"]}'}
        response = requests.post(
            f"{BASE_URL}/auth/change-password",
            headers=headers,
            json={
                'currentPassword': TEST_USER['password'],
                'newPassword': 'short'  # Only 5 chars
            },
            timeout=10
        )
        
        if response.status_code == 400:
            log_test('Change Password - short new password', True, "Correctly rejected short password")
            return True
        else:
            log_test('Change Password - short new password', False, f"Expected 400, got {response.status_code}")
            return False
    except Exception as e:
        log_test('Change Password - short new password', False, f"Exception: {str(e)}")
        return False

def test_change_password_missing_fields():
    """Test POST /api/auth/change-password with missing fields"""
    try:
        headers = {'Authorization': f'Bearer {TEST_USER["token"]}'}
        response = requests.post(
            f"{BASE_URL}/auth/change-password",
            headers=headers,
            json={
                'currentPassword': TEST_USER['password']
                # Missing newPassword
            },
            timeout=10
        )
        
        if response.status_code == 400:
            log_test('Change Password - missing fields', True, "Correctly rejected missing newPassword")
            return True
        else:
            log_test('Change Password - missing fields', False, f"Expected 400, got {response.status_code}")
            return False
    except Exception as e:
        log_test('Change Password - missing fields', False, f"Exception: {str(e)}")
        return False

def test_admin_stats_with_admin():
    """Test GET /api/admin/stats with admin token"""
    try:
        headers = {'Authorization': f'Bearer {ADMIN_USER["token"]}'}
        response = requests.get(f"{BASE_URL}/admin/stats", headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            required_keys = ['totalUsers', 'totalCalculations', 'totalAISessions', 'totalProjects', 'planBreakdown']
            if all(k in data for k in required_keys):
                plan_breakdown = data.get('planBreakdown', {})
                if all(k in plan_breakdown for k in ['free', 'pro', 'enterprise']):
                    log_test('Admin Stats - with admin', True, f"Stats: {data['totalUsers']} users, planBreakdown: {plan_breakdown}")
                    return True
                else:
                    log_test('Admin Stats - with admin', False, f"Missing plan breakdown keys: {plan_breakdown}")
                    return False
            else:
                log_test('Admin Stats - with admin', False, f"Missing required keys. Got: {list(data.keys())}")
                return False
        else:
            log_test('Admin Stats - with admin', False, f"Status {response.status_code}: {response.text}")
            return False
    except Exception as e:
        log_test('Admin Stats - with admin', False, f"Exception: {str(e)}")
        return False

def test_admin_stats_with_user():
    """Test GET /api/admin/stats with non-admin user token"""
    try:
        headers = {'Authorization': f'Bearer {TEST_USER["token"]}'}
        response = requests.get(f"{BASE_URL}/admin/stats", headers=headers, timeout=10)
        
        if response.status_code == 403:
            log_test('Admin Stats - with non-admin', True, "Correctly rejected non-admin user")
            return True
        else:
            log_test('Admin Stats - with non-admin', False, f"Expected 403, got {response.status_code}")
            return False
    except Exception as e:
        log_test('Admin Stats - with non-admin', False, f"Exception: {str(e)}")
        return False

def test_admin_stats_no_auth():
    """Test GET /api/admin/stats without auth"""
    try:
        response = requests.get(f"{BASE_URL}/admin/stats", timeout=10)
        
        if response.status_code == 401:
            log_test('Admin Stats - no auth', True, "Correctly rejected without auth")
            return True
        else:
            log_test('Admin Stats - no auth', False, f"Expected 401, got {response.status_code}")
            return False
    except Exception as e:
        log_test('Admin Stats - no auth', False, f"Exception: {str(e)}")
        return False

def test_admin_users_with_admin():
    """Test GET /api/admin/users with admin token"""
    try:
        headers = {'Authorization': f'Bearer {ADMIN_USER["token"]}'}
        response = requests.get(f"{BASE_URL}/admin/users", headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if 'users' in data and isinstance(data['users'], list):
                users = data['users']
                if len(users) >= 2:  # At least admin and test user
                    # Verify password field is NOT present
                    has_password = any('password' in u for u in users)
                    if not has_password:
                        log_test('Admin Users - with admin', True, f"Retrieved {len(users)} users, password field excluded")
                        return True
                    else:
                        log_test('Admin Users - with admin', False, "Password field should not be present in users")
                        return False
                else:
                    log_test('Admin Users - with admin', False, f"Expected at least 2 users, got {len(users)}")
                    return False
            else:
                log_test('Admin Users - with admin', False, f"Missing or invalid users array: {data}")
                return False
        else:
            log_test('Admin Users - with admin', False, f"Status {response.status_code}: {response.text}")
            return False
    except Exception as e:
        log_test('Admin Users - with admin', False, f"Exception: {str(e)}")
        return False

def test_admin_users_with_user():
    """Test GET /api/admin/users with non-admin user token"""
    try:
        headers = {'Authorization': f'Bearer {TEST_USER["token"]}'}
        response = requests.get(f"{BASE_URL}/admin/users", headers=headers, timeout=10)
        
        if response.status_code == 403:
            log_test('Admin Users - with non-admin', True, "Correctly rejected non-admin user")
            return True
        else:
            log_test('Admin Users - with non-admin', False, f"Expected 403, got {response.status_code}")
            return False
    except Exception as e:
        log_test('Admin Users - with non-admin', False, f"Exception: {str(e)}")
        return False

def test_admin_users_no_auth():
    """Test GET /api/admin/users without auth"""
    try:
        response = requests.get(f"{BASE_URL}/admin/users", timeout=10)
        
        if response.status_code == 401:
            log_test('Admin Users - no auth', True, "Correctly rejected without auth")
            return True
        else:
            log_test('Admin Users - no auth', False, f"Expected 401, got {response.status_code}")
            return False
    except Exception as e:
        log_test('Admin Users - no auth', False, f"Exception: {str(e)}")
        return False

def test_admin_update_user_plan_success():
    """Test POST /api/admin/users/{userId}/plan with admin token"""
    try:
        headers = {'Authorization': f'Bearer {ADMIN_USER["token"]}'}
        target_user_id = TEST_USER['userId']
        
        response = requests.post(
            f"{BASE_URL}/admin/users/{target_user_id}/plan",
            headers=headers,
            json={
                'plan': 'pro'
            },
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success') == True and data.get('plan') == 'pro':
                log_test('Admin Update User Plan - success', True, f"User plan updated to: {data['plan']}")
                return True
            else:
                log_test('Admin Update User Plan - success', False, f"Unexpected response: {data}")
                return False
        else:
            log_test('Admin Update User Plan - success', False, f"Status {response.status_code}: {response.text}")
            return False
    except Exception as e:
        log_test('Admin Update User Plan - success', False, f"Exception: {str(e)}")
        return False

def test_verify_plan_update():
    """Verify plan update by calling /api/auth/me as target user"""
    try:
        headers = {'Authorization': f'Bearer {TEST_USER["token"]}'}
        response = requests.get(f"{BASE_URL}/auth/me", headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get('plan') == 'pro':
                log_test('Verify Plan Update', True, f"User plan confirmed as: {data['plan']}")
                return True
            else:
                log_test('Verify Plan Update', False, f"Expected plan 'pro', got: {data.get('plan')}")
                return False
        else:
            log_test('Verify Plan Update', False, f"Status {response.status_code}: {response.text}")
            return False
    except Exception as e:
        log_test('Verify Plan Update', False, f"Exception: {str(e)}")
        return False

def test_admin_update_user_plan_invalid():
    """Test POST /api/admin/users/{userId}/plan with invalid plan"""
    try:
        headers = {'Authorization': f'Bearer {ADMIN_USER["token"]}'}
        target_user_id = TEST_USER['userId']
        
        response = requests.post(
            f"{BASE_URL}/admin/users/{target_user_id}/plan",
            headers=headers,
            json={
                'plan': 'gold'  # Invalid plan
            },
            timeout=10
        )
        
        if response.status_code == 400:
            log_test('Admin Update User Plan - invalid plan', True, "Correctly rejected invalid plan")
            return True
        else:
            log_test('Admin Update User Plan - invalid plan', False, f"Expected 400, got {response.status_code}")
            return False
    except Exception as e:
        log_test('Admin Update User Plan - invalid plan', False, f"Exception: {str(e)}")
        return False

def test_admin_update_user_plan_not_found():
    """Test POST /api/admin/users/{userId}/plan with non-existent userId"""
    try:
        headers = {'Authorization': f'Bearer {ADMIN_USER["token"]}'}
        fake_user_id = 'non-existent-user-id-12345'
        
        response = requests.post(
            f"{BASE_URL}/admin/users/{fake_user_id}/plan",
            headers=headers,
            json={
                'plan': 'pro'
            },
            timeout=10
        )
        
        if response.status_code == 404:
            log_test('Admin Update User Plan - user not found', True, "Correctly returned 404 for non-existent user")
            return True
        else:
            log_test('Admin Update User Plan - user not found', False, f"Expected 404, got {response.status_code}")
            return False
    except Exception as e:
        log_test('Admin Update User Plan - user not found', False, f"Exception: {str(e)}")
        return False

def test_admin_update_user_plan_non_admin():
    """Test POST /api/admin/users/{userId}/plan with non-admin user token"""
    try:
        headers = {'Authorization': f'Bearer {TEST_USER["token"]}'}
        target_user_id = ADMIN_USER['userId']
        
        response = requests.post(
            f"{BASE_URL}/admin/users/{target_user_id}/plan",
            headers=headers,
            json={
                'plan': 'enterprise'
            },
            timeout=10
        )
        
        if response.status_code == 403:
            log_test('Admin Update User Plan - non-admin', True, "Correctly rejected non-admin user")
            return True
        else:
            log_test('Admin Update User Plan - non-admin', False, f"Expected 403, got {response.status_code}")
            return False
    except Exception as e:
        log_test('Admin Update User Plan - non-admin', False, f"Exception: {str(e)}")
        return False

def print_summary():
    """Print test summary"""
    print("\n" + "="*80)
    print("TEST SUMMARY - ROUND 2")
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
    """Run all Round 2 tests in sequence"""
    print("="*80)
    print("CivilCalc Pro Backend API Test Suite - ROUND 2")
    print("="*80)
    print(f"Base URL: {BASE_URL}")
    print(f"Admin: {ADMIN_USER['email']}")
    print(f"Test User: {TEST_USER['email']}")
    print("="*80 + "\n")
    
    # Setup: Login admin and create test user
    print("🔐 Setup: Admin Login & User Signup...")
    if not test_admin_login():
        print("⚠️  Admin login failed, cannot continue")
        print_summary()
        return
    
    if not test_user_signup():
        print("⚠️  User signup failed, cannot continue")
        print_summary()
        return
    
    # Test 1: Update Profile
    print("\n👤 Testing POST /api/auth/update-profile...")
    test_update_profile_success()
    test_update_profile_no_auth()
    test_update_profile_missing_fields()
    test_update_profile_email_taken()
    
    # Test 2: Change Password
    print("\n🔑 Testing POST /api/auth/change-password...")
    test_change_password_success()
    test_login_with_new_password()
    test_login_with_old_password()
    test_change_password_wrong_current()
    test_change_password_short_new()
    test_change_password_missing_fields()
    
    # Test 3: Admin Stats
    print("\n📊 Testing GET /api/admin/stats...")
    test_admin_stats_with_admin()
    test_admin_stats_with_user()
    test_admin_stats_no_auth()
    
    # Test 4: Admin Users
    print("\n👥 Testing GET /api/admin/users...")
    test_admin_users_with_admin()
    test_admin_users_with_user()
    test_admin_users_no_auth()
    
    # Test 5: Admin Update User Plan
    print("\n💼 Testing POST /api/admin/users/{userId}/plan...")
    test_admin_update_user_plan_success()
    test_verify_plan_update()
    test_admin_update_user_plan_invalid()
    test_admin_update_user_plan_not_found()
    test_admin_update_user_plan_non_admin()
    
    print_summary()

if __name__ == '__main__':
    main()
