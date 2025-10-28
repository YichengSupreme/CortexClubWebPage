#!/usr/bin/env python3
"""
Simple local server for Cortex Club website
Run this to test the site locally with events functionality
"""

import http.server
import socketserver
import webbrowser
import sys

PORT = 8000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()

def run_server():
    handler = MyHTTPRequestHandler
    
    try:
        with socketserver.TCPServer(("", PORT), handler) as httpd:
            print(f"🚀 Server running at http://localhost:{PORT}")
            print(f"📂 Serving: {sys.path[0]}")
            print(f"🌐 Opening browser...")
            print(f"⏹️  Press Ctrl+C to stop\n")
            
            # Open browser automatically
            webbrowser.open(f'http://localhost:{PORT}')
            
            # Start serving
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\n✅ Server stopped. Goodbye!")
        sys.exit(0)
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"❌ Port {PORT} is already in use!")
            print(f"   Try: lsof -ti:{PORT} | xargs kill")
        else:
            print(f"❌ Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    run_server()

