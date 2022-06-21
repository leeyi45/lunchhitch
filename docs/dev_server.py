import argparse
import os
from http.server import SimpleHTTPRequestHandler
from socketserver import TCPServer

class Handler(SimpleHTTPRequestHandler):
  def __init__(self, directory: str, *args, **kwargs):
    super().__init__(*args, directory=directory, **kwargs)

def main(args):
  directory = os.path.abspath('docs')
  with TCPServer((args.ip, args.port), lambda *args, **kwargs: Handler(directory, *args, **kwargs)) as server:
    print(f'Serving {directory} at {args.ip}:8000')
    server.serve_forever()


def parse_arguments():
  parser = argparse.ArgumentParser()

  parser.add_argument('--port', default=8000, type=int, help='Port to serve')
  parser.add_argument('--ip', default='localhost', help='Address to bind to')

  return parser.parse_args()

if __name__ == "__main__":
  args = parse_arguments()
  main(args)

