import requests

def main():
    resp = requests.post('http://localhost:3000/api/userinfo?method=findFirst', json={
        'where': {
            'id': 'leeyi45'
        }
    })
    print(resp.text)

if __name__ == "__main__":
    main()
