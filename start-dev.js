// start-dev.js
const { execSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

function getLocalIp() {
    const ifaces = os.networkInterfaces();
    for (const iface in ifaces) {
        for (const alias of ifaces[iface]) {
            if (alias.family === 'IPv4' && !alias.internal) return alias.address;
        }
    }
    return '127.0.0.1';
}

function getHostName() {
    return os.hostname();
}

const ip = getLocalIp();
const host = getHostName();
const certName = `${ip}+${host}.pem`;
const keyName = `${ip}+${host}-key.pem`;

// folder na certyfikaty
const certDir = path.resolve(__dirname, 'certs');
if (!fs.existsSync(certDir)) fs.mkdirSync(certDir);

const certPath = path.join(certDir, certName);
const keyPath = path.join(certDir, keyName);

// generowanie certyfikatu, jeœli nie istnieje
if (!fs.existsSync(certPath) || !fs.existsSync(keyPath)) {
    console.log('Generujê certyfikat mkcert dla:', ip, host);
    execSync(`mkcert -cert-file ${certPath} -key-file ${keyPath} ${ip} ${host}`, { stdio: 'inherit' });
}

// start React dev server
console.log('Uruchamiam React dev server...');
//execSync(`set HTTPS=true&&set SSL_CRT_FILE=${certPath}&&set SSL_KEY_FILE=${keyPath}&&set HOST=0.0.0.0&&react-scripts start`, { stdio: 'inherit', shell: true });
execSync(
    `set HTTPS=true&&set SSL_CRT_FILE=${certPath}&&set SSL_KEY_FILE=${keyPath}&&set HOST=${ip}&&react-scripts start`,
    { stdio: 'inherit', shell: true }
);
