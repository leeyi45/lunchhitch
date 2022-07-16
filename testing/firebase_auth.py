import requests

def main():
    resp = requests.post('http://localhost:3000/api/orders', json={
        "where": {
            "OR": [{ "fromId": "leeyi"}, { "fulfillerId": "leeyi", }]
        }
    })
    print(resp.text)

if __name__ == "__main__":
    main()
