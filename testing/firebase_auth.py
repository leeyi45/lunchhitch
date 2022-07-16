import requests

def main():
    resp = requests.post('http://localhost:3000/api/userinfo/create', json={
        "displayName": "Lee Yi",
        "username": "leeyi",
        "email": "leeyi45@gmail.com",
        "phoneNumber": "99999999",
    })
    print(resp.text)

if __name__ == "__main__":
    main()
