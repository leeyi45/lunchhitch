import requests

def main():
    resp = requests.post('http://localhost:3000/api/prisma?collection=order&method=findMany', json={
        'where': {
        }
    })
    print(resp.text)

if __name__ == "__main__":
    main()
