import requests

def main():
    resp = requests.post('http://localhost:3000/api/prisma?collection=userInfo&method=findFirst', json={
        'where': {
            'id': 'yeet'
        }
    })
    with open('test.html', 'w') as file:
        file.write(resp.text)
    print(resp.text)

if __name__ == "__main__":
    main()
