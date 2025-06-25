const express = require('express');
const app = express();
const port = process.env.PORT || 3003;
const crypto = require('crypto');
const { enc, AES, mode, pad } = require('crypto-js'); // 使用 crypto-js 替代 rsa.js
const f = require('./fun.js');

// 启用JSON解析中间件
app.use(express.json());
app.use(express.static('public')); // 用于提供静态文件


// 生成随机的16位密钥
function generateRandomKey(length = 16) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }
  

// GET端点 - 服务说明
app.get('/', (req, res) => {
    res.json({ 
        message: "欢迎使用网盘URL加密API",
        api: {
            endpoint: "/encrypt",
            method: "POST",
            request_format: { url: "要加密的URL" },
            response_format: { code: "加密后的代码" }
        },
        usage: "将返回的代码输出到页面，将自动跳转到对应的URL"
    });
});

// URL加密端点
app.post('/encrypt', (req, res) => {
    const url = req.body.url;
    
    if (!url) {
        return res.status(400).json({ error: "缺少URL参数" });
    }
    
    const key = generateRandomKey();
    try {
        // 使用AES-CBC模式加密URL
        const encrypted = encryptUrl(key, url);
        
        // 生成自动跳转的HTML代码
        const redirectCode = generateRedirectCode(key, encrypted);
        
        res.json({ 
            code: redirectCode,
            original_url: url,
            encrypted_data: encrypted
        });
    } catch (error) {
        res.status(500).json({ error: "加密失败", details: error.message });
    }
});

// 加密函数
function encryptUrl(ekey, url) {
    // 将密钥转换为CryptoJS可用的格式
    const key = enc.Latin1.parse(ekey);
    const iv = enc.Latin1.parse(ekey);
    
    // 使用AES-CBC模式加密
    const encrypted = AES.encrypt(url, key, {
        iv: iv,
        mode: mode.CBC,
        padding: pad.Pkcs7
    });
    
    return encrypted.toString();
}

// 生成自动跳转的HTML代码
function generateRedirectCode(key, encryptedData) {
    const code = `skey = "${key}";var key = RSA.enc.Latin1.parse(skey);var iv = RSA.enc.Latin1.parse(skey);var decrypted = RSA.AES.decrypt(base64, key, {iv:iv,mode:RSA.mode.CBC});var result = decrypted.toString(RSA.enc.Utf8);location.href = result;`
    const sCode = f.encode(code);
    return `<script src='rsa.js'></script><script>var base64 = '${encryptedData}';</script><script>${sCode}</script>`;
}

// 启动服务器
app.listen(port, () => {
    console.log(`服务运行在 http://localhost:${port}`);
    console.log(`API端点: POST http://localhost:${port}/encrypt`);
});
