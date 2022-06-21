import os
from http.server import SimpleHTTPRequestHandler
from socketserver import TCPServer

class Handler(SimpleHTTPRequestHandler):
  def __init__(self, directory: str, *args, **kwargs):
    super().__init__(*args, directory=directory, **kwargs)

def main():
  directory = os.path.abspath('docs')
  with TCPServer(('localhost', 8000), lambda *args, **kwargs: Handler(directory, *args, **kwargs)) as server:
    print(f'Serving {directory} at localhost:8000')
    server.serve_forever()


if __name__ == "__main__":
  main()

