import http.server

class Handler(http.server.BaseHTTPRequestHandler):
    def do_POST(self):
        self.send_header('Content-Type', 'application/text')
        self.log_request()
        self.send_response(200, '{}')
        self.end_headers()


if __name__ == "__main__":
    with http.server.HTTPServer(('127.0.0.1', 8000), Handler) as httpd:
        httpd.serve_forever()