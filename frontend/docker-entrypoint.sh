#!/bin/sh
# Use PORT env var from Railway, default to 8080
PORT=${PORT:-8080}

# Generate nginx config at runtime with the correct port
cat > /etc/nginx/conf.d/default.conf << EOF
server {
    listen ${PORT};
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
EOF

echo "Starting nginx on port ${PORT}..."
exec nginx -g "daemon off;"
