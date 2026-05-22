require("dotenv").config();
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

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

app.post("/api/chat", (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Pesan wajib diisi." });
  }

  const reply = getBotReply(message);
  res.json({ reply });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Chatbot berjalan di http://localhost:${PORT}`);
});
