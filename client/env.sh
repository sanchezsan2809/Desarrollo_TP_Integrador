#!/bin/sh
# Este script se ejecuta automáticamente antes de que nginx arranque,
# gracias a la convención /docker-entrypoint.d/ de la imagen nginx:alpine.
# Sobreescribe env-config.js con el valor actual de REACT_APP_API_URL,
# permitiendo cambiar la URL del backend desde Portainer sin rebuildar la imagen.

cat > /usr/share/nginx/html/env-config.js << EOF
window._env_ = {
  REACT_APP_API_URL: '${REACT_APP_API_URL:-http://localhost:3000}'
};
EOF

echo "env-config.js generado: REACT_APP_API_URL=${REACT_APP_API_URL:-http://localhost:3000}"