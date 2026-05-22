require("dotenv").config();
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const publicDir = path.join(__dirname, "public");
const indexPath = path.join(publicDir, "index.html");

if (!fs.existsSync(indexPath)) {
  console.error("ERROR: index.html tidak ditemukan di:", indexPath);
  process.exit(1);
}

app.use(express.json());
app.use(express.static(publicDir));

function getBotReply(message) {
  const text = message.toLowerCase().trim();

  if (!text) {
    return "Silakan ketik pesan Anda terlebih dahulu.";
  }

  if (/halo|hai|hello|hi|selamat/.test(text)) {
    return "Halo! Senang bertemu dengan Anda. Ada yang bisa saya bantu hari ini?";
  }

  if (/jam|buka|operasional|jam berapa/.test(text)) {
    return "Layanan kami tersedia Senin–Jumat, 09.00–17.00 WIB.";
  }

  if (/harga|biaya|berapa|paket/.test(text)) {
    return "Untuk info harga dan paket, silakan hubungi tim kami di kontak@contoh.com atau isi formulir di halaman Kontak.";
  }

  if (/kontak|email|telepon|whatsapp|wa/.test(text)) {
    return "Anda bisa menghubungi kami lewat email kontak@contoh.com atau WhatsApp +62 812-3456-7890.";
  }

  if (/terima kasih|makasih|thanks/.test(text)) {
    return "Sama-sama! Jangan ragu untuk bertanya lagi.";
  }

  if (/bye|sampai|dadah|selamat tinggal/.test(text)) {
    return "Sampai jumpa! Semoga hari Anda menyenangkan.";
  }

  return (
    "Terima kasih atas pesannya. Saya masih bot demo — coba tanya tentang jam operasional, harga, atau kontak. " +
    "Untuk AI sungguhan, tambahkan API key di file .env (lihat .env.example)."
  );
}

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.post("/api/chat", (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Pesan wajib diisi." });
  }

  const reply = getBotReply(message);
  res.json({ reply });
});

app.get("/", (req, res) => {
  res.sendFile(indexPath);
});

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Chatbot berjalan di port ${PORT}`);
});

server.on("error", (err) => {
  console.error("Gagal menjalankan server:", err);
  process.exit(1);
});
