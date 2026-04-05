def fix_token_registration():
    with open('index.html', 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    bad_code = "const currentToken = await messaging.getToken({ vapidKey: VAPID_KEY });"
    good_code = """const registration = await navigator.serviceWorker.ready;
                const currentToken = await messaging.getToken({ 
                    vapidKey: VAPID_KEY, 
                    serviceWorkerRegistration: registration 
                });"""
    
    if bad_code in content:
        new_content = content.replace(bad_code, good_code)
        with open('index.html', 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("Success: Fixed Firebase getToken Service Worker scope.")
    else:
        print("Error: Target code not found in index.html.")

if __name__ == '__main__':
    fix_token_registration()
