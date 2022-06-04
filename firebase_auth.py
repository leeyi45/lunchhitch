import requests


API_KEY ='AIzaSyAHOSjitvT_qw-NlZ1ip8uOD3vHSDheCcM' 

def main():
    resp = requests.post(f'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={API_KEY}', json={
        'email': 'leeyi45@gmail.com',
        'password': 'rootroot',
        'returnSecureToken': True
    })
    print(resp.json())


if __name__ == '__main__':
    main()