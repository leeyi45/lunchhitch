import requests


API_KEY ='AIzaSyAHOSjitvT_qw-NlZ1ip8uOD3vHSDheCcM' 

def main():
    resp = requests.post(f'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={API_KEY}', json={
        'email': 'leeyi45@lunchhitch.firebaseapp.com',
        'password': 'rootroot',
        'returnSecureToken': True
    })
    
    resp_data = resp.json()
    update_resp = requests.post(f'https://identitytoolkit.googleapis.com/v1/accounts:update?key={API_KEY}', json={
        'idToken': resp_data['idToken'],
        'displayName': 'Lee Yi'
    })

    print(update_resp.json())


if __name__ == '__main__':
    main()