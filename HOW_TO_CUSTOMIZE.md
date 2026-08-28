# How to Customize Website Undangan

Panduan ini menjelaskan cara mengganti isi website undangan **Coastal Heirloom** tanpa mengubah struktur fitur utamanya. Proyek ini menggunakan React + TypeScript dan seluruh data pasangan disimpan dalam satu objek konfigurasi di `client/src/pages/Home.tsx`.

> **Catatan penting:** Data pada versi saat ini adalah data contoh. Ganti seluruh data pasangan, rekening, venue, foto, dan tanggal sebelum membagikan URL undangan kepada tamu.

## 1. Menjalankan proyek secara lokal

Pastikan Node.js dan pnpm tersedia, kemudian jalankan perintah berikut dari folder repository:

```bash
pnpm install
pnpm dev
```

Buka URL lokal yang ditampilkan oleh Vite. Untuk memeriksa kualitas kode dan production build, gunakan:

```bash
pnpm check
pnpm build
```

Perintah `pnpm check` menjalankan pemeriksaan TypeScript, sedangkan `pnpm build` membuat bundle produksi.

## 2. Lokasi file yang paling sering diubah

| Kebutuhan | File | Bagian yang diubah |
|---|---|---|
| Nama, tanggal, venue, rekening, Maps, musik | `client/src/pages/Home.tsx` | Objek `config` di bagian atas file |
| Foto hero dan galeri | `client/src/pages/Home.tsx` | Array `photos` dan URL pada CSS hero |
| Copy undangan | `client/src/pages/Home.tsx` | JSX section hero, cerita, acara, RSVP, dan tanda kasih |
| Warna, font, spacing, responsive layout | `client/src/index.css` | Design tokens dan aturan komponen |
| Judul browser dan metadata | `client/index.html` | `<title>`, description, dan Google Fonts |
| Arah visual dan keputusan desain | `ideas.md` | Brief desain Coastal Heirloom |

Jangan menyimpan gambar atau file media berukuran besar di `client/public/` atau `client/src/assets/`. Gunakan asset URL dari penyimpanan proyek agar deployment tetap ringan.

## 3. Mengganti data pasangan

Buka `client/src/pages/Home.tsx`, lalu edit objek `config` yang terletak di bagian paling atas. Contoh struktur datanya adalah sebagai berikut:

```ts
const config = {
  names: "Nara & Elio",
  shortNames: "Nara & Elio",
  parents: "Nama orang tua mempelai 1 / Nama orang tua mempelai 2",
  dateLabel: "Sabtu, 14 November 2026",
  dateISO: "2026-11-14T15:30:00+07:00",
  akad: {
    time: "15.30 WIB",
    venue: "Nama venue akad",
    address: "Alamat lengkap venue",
  },
  reception: {
    time: "18.30 WIB",
    venue: "Nama venue resepsi",
    address: "Alamat lengkap venue",
  },
  mapsUrl: "https://maps.google.com/?q=Nama+Venue",
  calendarUrl: "URL Google Calendar yang sudah terisi",
  ewallet: {
    provider: "DANA",
    number: "08xxxxxxxxxx",
    recipient: "Nama penerima",
  },
  bank: {
    name: "Bank BCA",
    number: "xxxxxxxxxx",
    recipient: "Nama pemilik rekening",
  },
  audioSrc: "https://domain-anda.com/musik-instrumental.mp3",
};
```

Gunakan format ISO dengan timezone untuk `dateISO`. Countdown membaca nilai ini secara langsung. Untuk Indonesia bagian barat, timezone yang umum digunakan adalah `+07:00`. Pastikan tanggal pada `dateLabel`, `dateISO`, tombol Calendar, dan copy undangan konsisten.

`parents` sudah tersedia sebagai konfigurasi terpusat, tetapi pada template saat ini belum ditampilkan di section utama. Jika ingin menampilkannya, sisipkan `{config.parents}` pada lokasi copy yang diinginkan.

## 4. Personalisasi nama tamu melalui URL

Nama tamu dibaca dari query parameter `to`. Contoh URL:

```text
https://undangandb-hp772fvk.manus.space/?to=Keluarga%20Budi%20Santoso
```

Jika parameter tidak diberikan, cover menampilkan `Tamu undangan`. Spasi dirapikan, panjang nama dibatasi, dan nilai diperlakukan sebagai teks biasa.

Untuk membuat beberapa link tamu, gunakan URL encoding untuk spasi dan karakter khusus. Contoh:

```text
?to=Keluarga%20Budi%20Santoso
?to=Rina%20%26%20Dani
```

Jangan menaruh informasi sensitif di parameter URL karena query string dapat terlihat pada riwayat browser dan analytics.

## 5. Mengganti musik latar

Isi `config.audioSrc` dengan URL file audio yang dapat diakses publik dan menggunakan format yang didukung browser, misalnya MP3. Jangan biarkan atribut ini diisi string kosong untuk elemen audio; implementasi saat ini sengaja tidak merender elemen `<audio>` apabila URL belum tersedia.

```ts
audioSrc: "https://domain-anda.com/audio/instrumental-romantis.mp3",
```

Playback dimulai setelah tamu menekan **Buka undangan** untuk mengikuti aturan autoplay browser. Jika URL belum diisi, tombol musik tetap tampil tetapi akan menjelaskan bahwa musik belum dikonfigurasi. Pastikan Anda memiliki hak penggunaan atas file audio sebelum dipublikasikan.

## 6. Mengganti foto dan artwork

Array `photos` di `Home.tsx` berisi enam item galeri. Setiap item memiliki `src`, `alt`, dan `caption`:

```ts
{
  src: "URL-FOTO",
  alt: "Deskripsi foto untuk pembaca layar",
  caption: "Keterangan singkat",
}
```

Gunakan URL berbeda untuk setiap foto agar masonry gallery tidak menduplikasi gambar. Tulis `alt` yang menjelaskan isi foto secara ringkas, bukan nama file. Cover dan artwork story menggunakan URL asset terpisah di JSX dan CSS.

Untuk asset yang dibuat atau diunggah ke penyimpanan proyek, gunakan URL `/manus-storage/...` yang diberikan oleh sistem. Jangan mengganti URL tersebut dengan path lokal seperti `/home/ubuntu/...` karena path lokal tidak tersedia pada deployment.

Jika ingin mengganti hero, ubah kedua referensi berikut agar tetap konsisten:

```css
.cover-image { background: url('/manus-storage/hero-baru.jpg') center/cover; }
.hero { background: #18364a url('/manus-storage/hero-baru.jpg') center/cover; }
```

Periksa kontras teks setelah mengganti gambar. Untuk foto yang terang, tambahkan overlay lebih gelap pada `.cover-shade` atau `.hero:after`.

## 7. Mengganti emblem dan identitas visual

Emblem digunakan pada cover, header, footer, dan favicon potensial. Ganti URL berikut pada `Home.tsx` dengan file PNG transparan baru:

```text
/manus-storage/coastal-heirloom-emblem_9c0ff1e5.png
```

Emblem sebaiknya berupa simbol tanpa teks sehingga tetap terbaca pada ukuran kecil. Jika mengubah warna tema, sesuaikan juga `--primary`, `--accent`, warna section gelap, serta filter emblem terang di `index.css`.

## 8. Mengganti warna dan tipografi

Design token utama berada di bagian `:root` pada `client/src/index.css`:

```css
:root {
  --background: #f2eee6;
  --foreground: #18364a;
  --primary: #18364a;
  --accent: #b86f52;
  --border: #d8d0c3;
}
```

Template memakai **Cormorant Garamond** untuk display heading dan **DM Sans** untuk body copy. Jika mengganti font, ubah dua bagian sekaligus: link Google Fonts di `client/index.html` dan deklarasi `font-family` di `client/src/index.css`.

Pertahankan rasio kontras antara teks dan latar. Hindari mengganti warna teks gelap menjadi warna terang pada section kertas, atau teks terang menjadi warna gelap pada section biru tinta tanpa menguji ulang screenshot desktop dan mobile.

## 9. Mengubah konten cerita dan label section

Copy langsung ditulis di JSX agar mudah ditemukan melalui pencarian teks. Cari heading berikut untuk mengubahnya:

| Section | Teks penanda saat ini |
|---|---|
| Hero | `Satu garis pantai, dua arah pulang.` |
| Cerita | `Berawal dari percakapan kecil di tepi laut.` |
| Acara | `Waktu yang ingin kami bagi.` |
| Galeri | `Beberapa frame yang kami simpan.` |
| RSVP | `Tinggalkan satu kalimat untuk kami bawa ke hari berikutnya.` |
| Tanda kasih | `Doa baikmu sudah lebih dari cukup.` |

Pertahankan copy yang spesifik terhadap pasangan. Hindari filler seperti “Welcome to our website” atau kalimat generik yang tidak menambah konteks personal.

## 10. Google Maps dan Google Calendar

`mapsUrl` dibuka pada tab baru. Ganti nilainya dengan URL lokasi final, lalu uji tombol **Lihat lokasi** pada browser.

`calendarUrl` juga dibuka pada tab baru dan saat ini sudah menggunakan URL template Google Calendar. Jika mengganti jadwal, perbarui judul, rentang waktu UTC, deskripsi, lokasi, dan timezone secara bersamaan. Gunakan generator URL Calendar atau encode parameter URL dengan benar sehingga spasi dan tanda baca tidak merusak link.

```text
https://calendar.google.com/calendar/render?action=TEMPLATE&text=...
```

## 11. RSVP dan guestbook

Versi static ini menyimpan RSVP di `localStorage` browser melalui key `nara-elio-guestbook`. Artinya pesan hanya terlihat pada perangkat dan browser tempat pesan dikirim; data belum masuk ke server dan tidak dapat digunakan sebagai daftar tamu terpusat.

Validasi HTML `required` digunakan untuk nama dan pesan. Setelah dikirim, pesan baru langsung ditampilkan di guestbook tanpa reload. Tidak ada data tamu awal atau testimonial buatan.

Untuk sistem produksi, upgrade proyek ke backend/database dan pindahkan proses penyimpanan RSVP ke endpoint server yang memvalidasi input, membatasi spam, dan melindungi data pribadi. Jangan menyimpan data RSVP sensitif pada kode frontend.

## 12. Tanda kasih dan QR e-wallet

Detail e-wallet dan rekening diambil dari `config.ewallet` serta `config.bank`. Tombol salin menggunakan Clipboard API dengan fallback yang aman, lalu mengubah label menjadi `Tersalin` selama sekitar dua detik.

QR dibuat dari payload berikut:

```text
DANA:<nomor> ; RECIPIENT:<nama penerima>
```

Jika mengganti provider atau payload, ubah bagian URL `api.qrserver.com` pada JSX dan sesuaikan `alt` image. Uji QR menggunakan aplikasi pembayaran sebelum membagikan undangan. Pastikan nomor dan nama penerima sudah final karena kesalahan data pembayaran tidak dapat diperbaiki oleh styling website.

## 13. Mengubah navigasi

Navigasi desktop dan sticky bottom navigation mobile menggunakan anchor ID berikut:

```text
#story
#event
#gallery
#rsvp
#gift
```

Jika menambah section, berikan `id` unik dan tambahkan link desktop serta mobile bila section tersebut penting. Hindari link yang mengarah ke ID yang tidak ada karena akan menciptakan dead-end navigation.

## 14. Checklist sebelum publikasi

| Pemeriksaan | Status yang diharapkan |
|---|---|
| Nama pasangan dan orang tua | Sudah diganti dari data contoh |
| Tanggal, jam, venue, dan alamat | Konsisten di seluruh section |
| `dateISO` | Menghasilkan countdown yang benar |
| URL `?to=` | Nama tamu tampil dengan benar dan aman |
| Google Maps | Membuka lokasi final |
| Google Calendar | Membuat event dengan jadwal final |
| Foto | Enam foto berbeda, alt text deskriptif |
| Lightbox | Berfungsi dengan klik, Escape, ArrowLeft, ArrowRight |
| RSVP | Validasi kosong dan guestbook diuji |
| Rekening dan e-wallet | Nomor, provider, penerima, dan QR diverifikasi |
| Musik | URL valid atau `audioSrc` tetap kosong tanpa warning |
| Mobile 320–390 px | Tidak ada overflow horizontal |
| Reduced motion | Konten tetap terlihat tanpa animasi non-esensial |
| Build | `pnpm check` dan `pnpm build` berhasil |

Setelah perubahan selesai, jalankan pemeriksaan berikut:

```bash
pnpm check
pnpm build
```

Kemudian buka preview dan uji alur dari cover sampai footer pada desktop dan mobile. Periksa log konsol untuk memastikan tidak ada error React, terutama warning atribut `src` kosong.

## 15. Struktur perubahan yang aman

Untuk perubahan kecil, cukup edit `config`, `photos`, atau copy JSX. Untuk perubahan visual, edit token dan aturan komponen di `index.css`. Hindari menyebarkan data pasangan ke banyak komponen karena akan menyulitkan pembaruan dan meningkatkan risiko informasi tidak konsisten.

Jika ingin menambah integrasi server, jangan menaruh secret, token pembayaran, atau kredensial pada `Home.tsx`. Gunakan backend dan secret management proyek, lalu dokumentasikan perubahan arsitektur secara terpisah.

## Referensi

[1]: https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams "MDN URLSearchParams"
[2]: https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API "MDN Clipboard API"
[3]: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage "MDN Web Storage localStorage"
[4]: https://calendar.google.com/calendar/u/0/r/eventedit "Google Calendar event editor"
