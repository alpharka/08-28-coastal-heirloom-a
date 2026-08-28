/* Coastal Heirloom: editorial coastal modern, ink blue + shell paper + copper, asymmetric archive layout. */
import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { ArrowDownRight, ArrowLeft, ArrowRight, CalendarDays, Check, Clipboard, Copy, Heart, MapPin, Music2, Pause, X } from "lucide-react";

const config = {
  names: "Nara & Elio",
  shortNames: "Nara & Elio",
  parents: "Putri pertama dari Bapak Armand & Ibu Sari / Putra kedua dari Bapak Dimas & Ibu Ratih",
  dateLabel: "Sabtu, 14 November 2026",
  dateISO: "2026-11-14T15:30:00+07:00",
  akad: { time: "15.30 WIB", venue: "The Cove House", address: "Jl. Pantai Senja No. 18, Sanur, Bali" },
  reception: { time: "18.30 WIB", venue: "The Cove House", address: "Jl. Pantai Senja No. 18, Sanur, Bali" },
  mapsUrl: "https://maps.google.com/?q=The+Cove+House+Sanur+Bali",
  calendarUrl: "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Nara%20%26%20Elio%20%7C%20Pernikahan&dates=20261114T083000Z/20261114T130000Z&details=Satu%20garis%20pantai%2C%20dua%20arah%20pulang.&location=The%20Cove%20House%2C%20Sanur%2C%20Bali&ctz=Asia%2FJakarta",
  ewallet: { provider: "DANA", number: "0812 3456 7890", recipient: "Nara Prameswari" },
  bank: { name: "Bank BCA", number: "1234567890", recipient: "Elio Mahendra" },
  audioSrc: "",
};

const photos = [
  { src: "/manus-storage/coastal-heirloom-hero_df8fd7bd.jpg", alt: "Nara dan Elio berjalan di tepi pantai", caption: "The first horizon" },
  { src: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85", alt: "Pasangan berdiri berdampingan di bawah cahaya sore", caption: "A quiet afternoon" },
  { src: "/manus-storage/coastal-heirloom-sunset_f66950ea.jpg", alt: "Siluet pasangan di antara rumput pantai", caption: "Before the light fades" },
  { src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85", alt: "Detail kain dan bunga dalam sesi foto pernikahan", caption: "Small things, kept close" },
  { src: "/manus-storage/coastal-heirloom-detail_b368469d.jpg", alt: "Tangan memegang surat di atas kertas bertekstur", caption: "A letter for tomorrow" },
  { src: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=85", alt: "Pasangan saling tersenyum di luar ruangan", caption: "Where we land" },
];

function guestName() {
  const value = new URLSearchParams(window.location.search).get("to")?.replace(/\s+/g, " ").trim();
  return value ? value.slice(0, 64) : "Tamu undangan";
}

function formatRemaining(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return { days: Math.floor(total / 86400), hours: Math.floor((total % 86400) / 3600), minutes: Math.floor((total % 3600) / 60), seconds: total % 60 };
}

export default function Home() {
  const guest = useMemo(guestName, []);
  const [opened, setOpened] = useState(false);
  const [remaining, setRemaining] = useState(formatRemaining(new Date(config.dateISO).getTime() - Date.now()));
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [rsvp, setRsvp] = useState({ name: "", status: "Hadir", message: "" });
  const [entries, setEntries] = useState<Array<typeof rsvp & { createdAt: string }>>(() => JSON.parse(localStorage.getItem("nara-elio-guestbook") || "[]"));
  const [submitted, setSubmitted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => { const timer = window.setInterval(() => setRemaining(formatRemaining(new Date(config.dateISO).getTime() - Date.now())), 1000); return () => clearInterval(timer); }, []);
  useEffect(() => { document.body.style.overflow = lightbox !== null ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [lightbox]);
  useEffect(() => { if (lightbox === null) return; const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setLightbox(null); if (event.key === "ArrowLeft") setLightbox((lightbox + photos.length - 1) % photos.length); if (event.key === "ArrowRight") setLightbox((lightbox + 1) % photos.length); }; window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey); }, [lightbox]);
  useEffect(() => { const nodes = document.querySelectorAll(".reveal"); const observer = new IntersectionObserver((items) => items.forEach((item) => { if (item.isIntersecting) { item.target.classList.add("is-visible"); observer.unobserve(item.target); } }), { threshold: 0.12 }); nodes.forEach((node) => observer.observe(node)); return () => observer.disconnect(); }, [opened]);

  const openInvitation = async () => { setOpened(true); if (config.audioSrc && audioRef.current) { try { await audioRef.current.play(); setMusicPlaying(true); } catch { setMusicPlaying(false); } } };
  const toggleMusic = async () => { if (!config.audioSrc || !audioRef.current) { window.alert("Musik latar belum diatur. Tambahkan URL audio pada konfigurasi."); return; } if (musicPlaying) { audioRef.current.pause(); setMusicPlaying(false); } else { try { await audioRef.current.play(); setMusicPlaying(true); } catch { setMusicPlaying(false); } } };
  const copyValue = async (key: string, value: string) => { try { await navigator.clipboard.writeText(value); } catch { const input = document.createElement("textarea"); input.value = value; document.body.appendChild(input); input.select(); document.execCommand("copy"); input.remove(); } setCopied(key); window.setTimeout(() => setCopied(null), 2000); };
  const submitRsvp = (event: FormEvent) => { event.preventDefault(); if (!rsvp.name.trim() || !rsvp.message.trim()) return; const next = [...entries, { ...rsvp, name: rsvp.name.trim(), message: rsvp.message.trim(), createdAt: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) }]; setEntries(next); localStorage.setItem("nara-elio-guestbook", JSON.stringify(next)); setRsvp({ name: "", status: "Hadir", message: "" }); setSubmitted(true); };
  const shownPhoto = lightbox === null ? null : photos[lightbox];

  return <div className={`site-shell ${opened ? "is-open" : ""}`}>
    {config.audioSrc ? <audio ref={audioRef} src={config.audioSrc} loop aria-hidden="true" /> : null}
    <div className="cover" aria-hidden={opened}>
      <div className="cover-image" />
      <div className="cover-shade" />
      <div className="cover-content">
        <img className="emblem emblem-light" src="/manus-storage/coastal-heirloom-emblem_9c0ff1e5.png" alt="" />
        <p className="eyebrow light">A private invitation · 014</p>
        <p className="cover-guest">Untuk <strong>{guest}</strong></p>
        <h1>Nara <i>&</i> Elio</h1>
        <p className="cover-date">14 · 11 · 2026</p>
        <button className="open-button" onClick={openInvitation}>Buka undangan <ArrowDownRight size={17} /></button>
      </div>
      <p className="cover-credit">The Cove House · Sanur, Bali</p>
    </div>

    <header className="topbar">
      <a href="#top" className="brand"><img src="/manus-storage/coastal-heirloom-emblem_9c0ff1e5.png" alt="" /><span>N / E</span></a>
      <nav><a href="#story">Cerita</a><a href="#event">Detail acara</a><a href="#gallery">Galeri</a><a href="#rsvp">RSVP</a><a href="#gift">Tanda kasih</a></nav>
      <span className="top-date">14.11.26</span>
    </header>

    <main id="top">
      <section className="hero section-wide"><div className="hero-copy reveal"><p className="eyebrow">Chapter 01 · The beginning</p><h2>Satu garis pantai,<br /><em>dua arah pulang.</em></h2><p className="lead">Kami mengundangmu untuk menyaksikan satu hari yang telah lama kami simpan dalam hati.</p><a className="text-link" href="#story">Baca cerita kami <ArrowDownRight size={16} /></a></div><div className="hero-meta reveal"><span>14 / 11 / 2026</span><span>Sanur, Bali</span></div></section>

      <section id="story" className="story section-pad"><div className="section-label reveal"><span>02</span><span>Our story</span></div><div className="story-grid"><div className="story-art reveal"><img src="/manus-storage/coastal-heirloom-detail_b368469d.jpg" alt="Surat dan detail kecil di atas kertas" /><span className="art-caption">A note, kept close.</span></div><div className="story-copy reveal"><p className="eyebrow">The long way home</p><h3>Berawal dari percakapan kecil di tepi laut.</h3><p>Di antara sore yang terlalu cepat gelap dan rencana-rencana yang belum selesai, kami menemukan seseorang yang membuat pulang terasa lebih mudah.</p><p>Hari ini, kami memilih untuk melanjutkan perjalanan itu dengan nama yang sama—sebagai rumah bagi satu sama lain, juga bagi hari-hari yang akan datang.</p><div className="signature">Nara <span>×</span> Elio</div></div></div></section>

      <section id="event" className="event-section"><div className="section-pad"><div className="section-label light-label reveal"><span>03</span><span>Save the date</span></div><div className="event-heading reveal"><p className="eyebrow copper">Mark the hour</p><h3>Waktu yang ingin<br /><em>kami bagi.</em></h3><div className="countdown" aria-label="Hitung mundur menuju acara"><div><strong>{String(remaining.days).padStart(2, "0")}</strong><span>hari</span></div><b>:</b><div><strong>{String(remaining.hours).padStart(2, "0")}</strong><span>jam</span></div><b>:</b><div><strong>{String(remaining.minutes).padStart(2, "0")}</strong><span>menit</span></div><b>:</b><div><strong>{String(remaining.seconds).padStart(2, "0")}</strong><span>detik</span></div></div></div><div className="event-list"><article className="event-item reveal"><span className="event-number">01</span><div><p className="eyebrow copper">Akad nikah</p><h4>{config.akad.time}</h4><p>{config.akad.venue}<br />{config.akad.address}</p></div></article><article className="event-item reveal"><span className="event-number">02</span><div><p className="eyebrow copper">Resepsi</p><h4>{config.reception.time}</h4><p>{config.reception.venue}<br />{config.reception.address}</p></div></article></div><div className="event-actions reveal"><a className="button copper-button" href={config.mapsUrl} target="_blank" rel="noreferrer"><MapPin size={16} /> Lihat lokasi</a><a className="button ghost-button" href={config.calendarUrl} target="_blank" rel="noreferrer"><CalendarDays size={16} /> Simpan ke Calendar</a></div></div></section>

      <section id="gallery" className="gallery-section section-pad"><div className="section-label reveal"><span>04</span><span>Collected moments</span></div><div className="gallery-intro reveal"><h3>Beberapa frame<br /><em>yang kami simpan.</em></h3><p>Enam potongan kecil dari perjalanan sebelum hari ini.</p></div><div className="masonry">{photos.map((photo, index) => <button key={photo.src} className={`gallery-item gallery-${index + 1} reveal`} onClick={() => setLightbox(index)} aria-label={`Lihat foto: ${photo.caption}`}><img src={photo.src} alt={photo.alt} /><span><span>{photo.caption}</span><ArrowDownRight size={16} /></span></button>)}</div></section>

      <section id="rsvp" className="rsvp-section section-pad"><div className="section-label reveal"><span>05</span><span>Leave a note</span></div><div className="rsvp-grid"><div className="rsvp-copy reveal"><p className="eyebrow copper">Your presence matters</p><h3>Tinggalkan satu kalimat untuk kami bawa ke hari berikutnya.</h3><p>Konfirmasi kehadiranmu akan tersimpan di perangkat ini untuk sementara. Buku tamu di bawah hanya menampilkan pesan yang kamu kirimkan.</p></div><form className="rsvp-form reveal" onSubmit={submitRsvp}><label htmlFor="name">Nama lengkap</label><input id="name" value={rsvp.name} onChange={(e) => setRsvp({ ...rsvp, name: e.target.value })} placeholder="Tulis namamu" required /><fieldset><legend>Kehadiran</legend><label className="radio"><input type="radio" checked={rsvp.status === "Hadir"} onChange={() => setRsvp({ ...rsvp, status: "Hadir" })} /> Saya akan hadir</label><label className="radio"><input type="radio" checked={rsvp.status === "Belum pasti"} onChange={() => setRsvp({ ...rsvp, status: "Belum pasti" })} /> Belum bisa memastikan</label><label className="radio"><input type="radio" checked={rsvp.status === "Tidak hadir"} onChange={() => setRsvp({ ...rsvp, status: "Tidak hadir" })} /> Tidak dapat hadir</label></fieldset><label htmlFor="message">Pesan ucapan</label><textarea id="message" value={rsvp.message} onChange={(e) => setRsvp({ ...rsvp, message: e.target.value })} placeholder="Tulis ucapanmu di sini" rows={4} required /><button className="button primary-button" type="submit">Kirim konfirmasi <ArrowRight size={16} /></button>{submitted && <p className="success"><Check size={15} /> Terima kasih, pesanmu sudah ditambahkan.</p>}</form></div><div className="guestbook reveal"><p className="eyebrow">Guestbook · {entries.length}</p>{entries.length === 0 ? <p className="empty-state">Pesan ucapanmu akan muncul di sini setelah dikirim.</p> : entries.map((entry, index) => <div className="guest-entry" key={`${entry.createdAt}-${index}`}><div><strong>{entry.name}</strong><span>{entry.status} · {entry.createdAt}</span></div><p>{entry.message}</p></div>)}</div></section>

      <section id="gift" className="gift-section"><div className="section-pad gift-inner"><div className="section-label light-label reveal"><span>06</span><span>A little kindness</span></div><div className="gift-grid"><div className="gift-copy reveal"><p className="eyebrow copper">Tanda kasih</p><h3>Doa baikmu<br /><em>sudah lebih dari cukup.</em></h3><p>Jika ingin mengirimkan tanda kasih, kamu dapat menggunakan detail di bawah ini.</p></div><div className="gift-details reveal"><div className="qr-placeholder"><img className="qr-image" src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=8&data=${encodeURIComponent(`DANA:${config.ewallet.number};RECIPIENT:${config.ewallet.recipient}`)}`} alt="QR code untuk tanda kasih melalui DANA" /><span>SCAN TO SEND</span></div><div className="account"><p className="eyebrow copper">{config.ewallet.provider} · e-wallet</p><h4>{config.ewallet.number}</h4><p>{config.ewallet.recipient}</p><button onClick={() => copyValue("wallet", config.ewallet.number)}><Copy size={14} /> {copied === "wallet" ? "Tersalin" : "Salin nomor"}</button></div><div className="account"><p className="eyebrow copper">{config.bank.name}</p><h4>{config.bank.number}</h4><p>{config.bank.recipient}</p><button onClick={() => copyValue("bank", config.bank.number)}><Copy size={14} /> {copied === "bank" ? "Tersalin" : "Salin nomor"}</button></div></div></div></div></section>
    </main>

    <footer><img src="/manus-storage/coastal-heirloom-emblem_9c0ff1e5.png" alt="" /><p>With love, Nara & Elio</p><span>14 · 11 · 2026</span></footer>
    <button className="music-control" onClick={toggleMusic} aria-label={musicPlaying ? "Jeda musik" : "Putar musik"}>{musicPlaying ? <Pause size={17} /> : <Music2 size={17} />}</button>
    <nav className="mobile-nav"><a href="#story"><Heart size={16} /><span>Cerita</span></a><a href="#event"><CalendarDays size={16} /><span>Acara</span></a><a href="#gallery"><Copy size={16} /><span>Galeri</span></a><a href="#rsvp"><Clipboard size={16} /><span>RSVP</span></a></nav>

    {shownPhoto && <div className="lightbox" role="dialog" aria-modal="true" aria-label="Galeri foto" onClick={() => setLightbox(null)}><button className="lightbox-close" onClick={() => setLightbox(null)} aria-label="Tutup"><X /></button><button className="lightbox-prev" onClick={(e) => { e.stopPropagation(); setLightbox((lightbox! + photos.length - 1) % photos.length); }} aria-label="Foto sebelumnya"><ArrowLeft /></button><figure onClick={(e) => e.stopPropagation()}><img src={shownPhoto.src} alt={shownPhoto.alt} /><figcaption>{String(lightbox! + 1).padStart(2, "0")} · {shownPhoto.caption}</figcaption></figure><button className="lightbox-next" onClick={(e) => { e.stopPropagation(); setLightbox((lightbox! + 1) % photos.length); }} aria-label="Foto berikutnya"><ArrowRight /></button></div>}
  </div>;
}
