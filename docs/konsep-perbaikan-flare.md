# Pengantar konsep perbaikan Flare, FERA dan TOX

**Diperbarui:** 31 Oktober 2026. **Status:** dokumentasi untuk implementasi berikutnya. Backend, worker dan model prediktif baru belum dibangun oleh pekerjaan dokumentasi ini.

Spesifikasi authoritative adalah [Spesifikasi sistem FERA–TOX](./spesifikasi-sistem-fera-tox.md). Urutan pengerjaan, dependensi dan acceptance IDs tersedia pada [backlog implementasi](./backlog-perbaikan-flare.md). Dokumen ini menjadi pengantar; persamaan, DTO, API dan failure behavior tidak dipelihara sebagai versi kedua di sini.

## 1. Arah produk yang telah dipilih

Bangun engine mandiri untuk elevated flare, accidental release, jet fire, exhaust TOX/acid-gas dispersion, toksisitas, flash/pool fire, VCE, frekuensi impairment dan noise. PHAST menjadi pembanding eksternal. Cakupan luas tersebut diimplementasikan bertahap; model yang belum memiliki referensi/domain/validasi tetap tidak aktif dan menghasilkan `MODEL_NOT_READY`.

Tim internal memakai akun lokal. Frontend Next.js/React/TypeScript/Plotly berkomunikasi melalui API FastAPI/Pydantic. Perhitungan berada di Python 3.12 dengan NumPy/SciPy dan adapter properti `thermo`; Celery/Redis menjalankan pekerjaan terpisah. PostgreSQL menyimpan proyek, revisi, snapshot dan status; object storage kompatibel S3 menyimpan grid/artefak besar. Deployment memakai Docker Compose/VPS, Nginx dan satu origin HTTPS.

Tidak ada alur approval laporan. Engineer dapat mengekspor hasil yang tersedia; snapshot, versi, provenance serta diagnosis tetap disimpan. CFD bukan dependensi dasar; penggunaannya memerlukan kebutuhan domain kasus tersendiri.

## 2. Masalah yang melandasi perubahan

Evaluasi awal pada commit `9dc2066ca1e71b5bebc44cf8733622df53853316` menemukan energi pembakaran fiktif pada nitrogen murni, flameout yang masih menghasilkan api, sonic velocity dengan basis salah, status kepatuhan selalu lulus, receptor tidak digunakan, peta memakai rumus berbeda, radius tabel salah pasangan, CSV berbeda koordinat, serta hasil lama tetap tampil setelah input berubah.

Perbaikannya diarahkan pada satu engine authoritative dan satu snapshot hasil. Memindahkan rumus lama ke server saja tidak menyelesaikan defect fisika atau makna hasil tersebut. Backend baru harus menggunakan model, properti, source state dan penilaian yang telah dibenahi.

## 3. Prinsip yang wajib dipertahankan

- Bedakan konteks operasi, status penyalaan, jenis sumber dan kondisi terhadap waktu.
- Bedakan header/upstream, tip, throat dan source setelah ekspansi atmosfer.
- Gunakan satuan internal konsisten dan basis volume standar yang eksplisit.
- Pertahankan perbedaan antara nol fisik, tidak berlaku, belum dihitung, di luar domain dan gagal.
- Receptor, peta, kurva, compare dan laporan memakai runId, metric, waktu dan koordinat yang sama.
- Simpan snapshot immutable, versi engine/model/data dan hash fisik; perubahan input membuat hasil lama stale.
- Preflight memeriksa readiness dan domain; tidak ada fallback natural gas, clamp tersembunyi, atau PASS default.
- Jarak kontur, maksimum pada berbagai ketinggian, fluks, dose dan frekuensi impairment adalah metric yang berbeda.

## 4. Navigasi spesifikasi

| Kebutuhan | Bagian spesifikasi induk |
| --- | --- |
| Keputusan runtime dan arsitektur | 1–2 |
| Satuan, koordinat, status dan model registry | 3–5 |
| Perhitungan 14 modul dengan input/persamaan/algoritme/diagnosis/uji/referensi | 6 |
| Receptor, kontur, kriteria dan history | 7 |
| Database, revisi, snapshot dan artefak | 8 |
| Endpoint, contoh request/response dan error | 9 |
| Antrean, idempotensi, lease, retry, cancel dan recovery | 10 |
| State frontend dan koneksi jaringan | 11 |
| Laporan dan ekspor | 12 |
| Auth dan keamanan sesi | 13 |
| Docker/VPS, konfigurasi, monitoring dan restore | 14 |
| Migrasi legacy | 15 |
| Pengujian, benchmark, tahap delivery dan referensi | 16–18 |

## 5. Referensi dan bukti

- [Telaah TOX 2023](./telaah-referensi-phast-tox-2023.md): Phast 8.4, exhaust/flameout, SO2/H2S, averaging dan keluaran terhadap elevasi.
- [Reported contours TOX](./benchmarks/tox-2023-reported-contours.csv): 57 baris arsip, seluruhnya masih memerlukan rekonsiliasi sebelum menjadi golden test.
- [Telaah FERA Markdown 2026](./telaah-referensi-fera-2026.md): PHAST 9.0, UDM, TNO Multi-Energy dan contoh hasil non-CFD; sumber/table/override tertentu masih perlu diverifikasi.
- [Fixture analitik](./contoh-kasus-analitik.json): acuan independen untuk properti ideal, known-tip state, energi, radiasi titik dan contour. Ini bukan validasi korelasi flare/UDM/VCE.

Kondisi TOX, jet fire kebocoran dan elevated flare tidak dipaksakan menjadi satu kasus. Gambar yang hilang dan konflik data dicatat sebagai keterbatasan referensi, bukan ditutupi dengan koefisien agar hasil terlihat cocok.

## 6. Riwayat keputusan

[Konsep awal 30 Oktober 2026](./archive/konsep-perbaikan-flare-2026-10-30.md) dan [backlog awal](./archive/backlog-perbaikan-flare-2026-10-30.md) diarsipkan untuk konteks. Usulan engine murni TypeScript/frontend-only dalam arsip telah digantikan pilihan Python/backend setelah cakupan diperluas ke seluruh FERA dan TOX. Persamaan dasar dan temuan relevan dipertahankan pada spesifikasi induk.

Langkah implementasi pertama adalah fondasi skema/unit/status, akun/proyek/revisi/API, kemudian vertical slice analitik sampai worker, UI dan ekspor. Jangan menyatakan seluruh model siap hanya karena jalur infrastruktur tersebut bekerja.
