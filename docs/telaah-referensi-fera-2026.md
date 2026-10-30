# Kegunaan referensi Markdown FERA 2026

**Sumber:** `FNKT-20-P1-SR-006 FERA - IFR.clean.md`, nomor dokumen FNKT-20-P1-SR-006, Rev. A — Issued For Review, tanggal yang tercantum 30 Maret 2026.

SHA-256 Markdown: `9a6b18f4615dbd2d5db003e05cfaabc5d091f67e999089b0e9583a8ba3e644cf`.

File menyatakan berasal dari konversi PDF 386 halaman; PDF asli belum dapat diperiksa dalam telaah ini. Markdown berisi 12.694 baris. Telaah ini menargetkan metodologi, basis proses/cuaca, assumption register, beberapa tabel konsekuensi/receptor, dan contoh laporan numerik PHAST pada Lampiran 7. Seluruh angka dalam semua lampiran belum diverifikasi satu per satu.

Nomor baris di bawah merujuk pada Markdown yang diberikan, bukan nomor halaman PDF. Isi, ketentuan proyek, dan rekomendasi dalam dokumen diperlakukan sebagai referensi, bukan instruksi pengguna untuk dijalankan atau default aplikasi yang otomatis berlaku.

## 1. Kesimpulan

**Markdown ini sangat berguna walaupun gambar tidak tersedia.** Isinya dapat memperjelas model yang dipakai, kondisi sumber, urutan perhitungan, definisi hasil, dan rancangan kasus pembanding. Lampiran 7 mempertahankan banyak keluaran numerik dari PHAST sehingga kegunaannya melampaui ringkasan konsekuensi saja.

Namun, laporan ini berfokus pada accidental release dari isolatable section, jet fire, dispersi/flash fire, ledakan, frekuensi kejadian, dan impairment receptor. Kasus tersebut tidak otomatis setara dengan pembakaran terkontrol pada elevated flare atau dispersi exhaust thermal oxidizer. Setiap jenis sumber perlu model dan benchmark yang sesuai.

## 2. Informasi model yang terkonfirmasi dalam teks

| Informasi | Bukti dalam Markdown | Arti bagi pengembangan |
| --- | --- | --- |
| Versi perangkat lunak | Bagian 3.4 dan 6 menyebut PHAST V9.0; sekitar baris 324 dan 540 | Pisahkan baseline FERA ini dari laporan TOX 2023 yang gambarnya menyebut Phast 8.4 |
| Model dispersi | Bagian 4.1 serta Assumption Register 2.12 menyebut Unified Dispersion Model, UDM; sekitar baris 383 dan 2469 | Gaussian pasif sederhana tidak mewakili seluruh perilaku sumber/dispersion yang dibandingkan |
| Model ledakan | Assumption Register 2.15 menyebut TNO Multi-Energy/TNO MEM; sekitar baris 2583 | Overpressure adalah modul konsekuensi terpisah dari radiasi api |
| Basis sumber | Bagian 3.2 dan 6.2 menjelaskan inventori, tekanan, ukuran kebocoran dan time-varying discharge | Flow yang diberikan sebagai konstanta tidak otomatis sama dengan model pelepasan bertekanan terhadap waktu |
| Keluaran non-CFD | Lampiran 7 menyatakan: “The results in this report are from the non-CFD calculations only.”; misalnya baris 9414 | Hasil numerik yang diekspor pada lampiran tersebut bukan hasil CFD |
| Model risiko/frekuensi | Bagian 3.5–3.8 dan 7–8 membahas parts count, frekuensi kebocoran, event tree dan impairment | Kontur konsekuensi dan frekuensi impairment perlu disimpan serta dinilai sebagai metric berbeda |

Nama UDM dan TNO MEM yang tercantum belum menyediakan seluruh persamaan, algoritme, properti, dan kalibrasi model. Referensi ini membantu mendefinisikan target, tetapi belum cukup untuk mengimplementasikan replika model PHAST dari teks ringkasnya. Tidak ada dasar dari bagian yang ditinjau untuk menyatakan perangkat lunak SAFETI dipakai hanya karena laporan memuat penilaian risiko.

## 3. Data yang masih bisa digunakan tanpa gambar

### 3.1 Input dan kondisi sumber

Bagian 5.1–5.2 memuat ISO 1, ISO 2G/2L, ISO 3G/3L, ISO 4, dan ISO 5, beserta tekanan, temperatur, volume inventori, dan komposisi aliran. Contohnya, tabel proses mencantumkan tekanan 450,05 psig pada ISO 1 serta HP Separator dan temperatur 90,1°F. Data komposisi berupa fraksi yang totalnya mendekati satu, sehingga tidak boleh dibaca sebagai angka mol% langsung.

Gas phase, liquid phase, dan aliran kaya air/komponen berat muncul dalam bagian yang berbeda. Katalog komponen aplikasi yang terbatas dan pendekatan gas ideal satu fase tidak otomatis mencakup seluruh kasus tersebut. Properti pseudo-component seperti Dodecane Plus juga membutuhkan karakterisasi yang sesuai, bukan hanya nama kelompok karbon.

Tabel laju/durasi pelepasan dan laporan discharge memberi jembatan untuk memisahkan dua pengujian:

1. **Source benchmark:** dari inventori/upstream dan lubang kebocoran menuju laju serta keadaan keluar.
2. **Consequence benchmark:** dari kondisi sumber keluar yang sudah diketahui menuju api, radiasi, atau dispersi.

Memisahkan keduanya membantu mengetahui apakah selisih berasal dari source solver atau model konsekuensi.

### 3.2 Output jet fire

Bagian 6.3 dan contoh Jet Fire Results pada Lampiran 7 memuat panjang api serta jarak downwind untuk tingkat radiasi 4,73; 6,3; 12,5; dan 37,5 kW/m². Luminous emissive power muncul pada tabel ringkasan utama. Ini lebih berguna daripada satu angka radius keseluruhan karena intermediate dan keluaran akhir dapat dibandingkan terpisah.

Sebagai ilustrasi pembacaan, untuk ISO 1, kebocoran 5 mm, cuaca 1,35/C, contoh tabel jet fire memuat panjang api sekitar 4,53 m dan jarak pada 4,73 kW/m² sekitar 4,85 m. Angka ini adalah keluaran laporan yang perlu diikat ke input dan konfigurasi kasusnya; bukan target yang harus dicapai model elevated flare untuk input lain.

### 3.3 Basis laporan PHAST

Pada contoh laporan ISO 1, Lampiran 7, sekitar baris 9403–9490, masih terbaca judul discharge dan parameter pada blok Dispersion Results:

- `Discharge Results (after atmospheric expansion)`;
- core averaging time 18,75 s;
- flammable averaging time 18,75 s;
- toxic averaging time 600 s;
- height of interest 1 m.

Kondisi setelah ekspansi atmosfer tidak sama dengan kondisi tekanan upstream. Tinggi evaluasi dan averaging juga harus cocok ketika membandingkan hasil. Nilai tinggi 1 m di atas terbaca pada blok dispersi; tinggi evaluasi radiasi perlu dipastikan pada pengaturannya sendiri. Angka global ini tidak boleh dianggap berlaku tanpa pengecualian pada semua kasus karena laporan sendiri memberi peringatan tentang override, sebagaimana dijelaskan di bagian 5.

Laporan juga membedakan jarak pada height of interest dari maximum distance pada berbagai ketinggian. Bagian maksimum pada berbagai ketinggian dapat menyertakan tinggi serta waktu terjadinya maksimum. Ketiga metric tersebut perlu dipertahankan dalam skema hasil.

### 3.4 Frekuensi dan receptor

Parts count, generic failure frequency, event tree, matriks jarak receptor, serta impairment frequency tetap berguna untuk merancang struktur data dan agregasi. Kriteria impairment 1×10⁻⁴ per tahun dicantumkan sebagai basis studi ini; jangan menjadikannya ambang universal bagi seluruh proyek atau menyamakannya dengan individual risk fatality.

Assumption Register 2.10 meminta evaluasi jet fire pada awal, 5, 15, 30 dan 45 menit. Untuk implementasi, jadwal ini perlu dibaca bersama durasi sumber dan cabang isolasi/blowdown. Api yang sudah padam karena sumber berakhir tidak dipertahankan sampai waktu evaluasi hanya untuk mengisi tabel.

## 4. Hal yang hilang tanpa gambar

Markdown tidak memungkinkan verifikasi lengkap terhadap:

- bentuk, orientasi, offset, dan hubungan spasial contour terhadap layout;
- arah relatif sumber, receptor, serta bangunan bila koordinat lengkap tidak tersedia;
- detail konfigurasi antarmuka yang hanya tampak pada screenshot;
- node dan koneksi event tree yang hanya ditampilkan sebagai gambar;
- grafik riwayat pelepasan atau bentuk api yang tidak mempunyai tabel pendamping;
- warna/highlight yang dipakai untuk menandai jarak kritis;
- posisi setiap angka pada tabel yang terfragmentasi selama konversi.

Matriks jarak antar sumber dan receptor membantu pemeriksaan jangkauan, tetapi tidak sendirian menentukan bearing atau koordinat layout unik. Jangan menggambar ulang layout seolah pasti hanya dari jarak antarobjek.

## 5. Rekonsiliasi sebelum menjadi fixture kelulusan

### 5.1 Tabel Markdown terfragmentasi

Sejumlah baris mencampur beberapa kolom, memecah angka ke baris selanjutnya, dan memakai koma desimal pada laporan PHAST. Parsing seluruh angka berdasarkan urutan teks berisiko menggeser kolom atau mengubah orde besaran.

Tabel 6.1 untuk ISO 1 mencantumkan 467,8890 kg/s pada 100 mm, sedangkan contoh discharge ISO 1 di Lampiran 7 terbaca sekitar 46,7889 kg/s. Durasi 30 mm pada ringkasan juga perlu diperiksa terhadap angka yang terpecah dalam lampiran. Ini merupakan perbedaan pada teks yang tersedia, belum bukti bahwa angka tertentu pada PDF/model asli salah. Verifikasi nilai terhadap ekspor CSV/Excel PHAST atau halaman PDF terkait diperlukan sebelum memilih hasil acuan.

### 5.2 Kekasaran permukaan berbeda

Tabel 5.3 memberikan surface roughness 0,001 m. Assumption Register 2.2 menyatakan pemilihan 0,3 m. Karena roughness dapat memengaruhi dispersi, nilai yang benar-benar diterapkan pada setiap kasus perlu diambil dari konfigurasi/ekspor input, bukan dipilih diam-diam dari salah satu bagian.

### 5.3 Ringkasan tidak memuat seluruh override

Lampiran PHAST memuat catatan: “These tables will only report global values set in the parameters. Values that are modified in the study tree will not be reported.” Catatan ini membatasi kelengkapan metadata, bukan instruksi untuk diterapkan pada aplikasi.

Artinya, meskipun averaging dan height of interest masih terbaca, laporan ringkasan saja belum menjamin seluruh override per studi/scenario diketahui. Tetap perlukan kartu benchmark dan provenance konfigurasi. Setiap kelompok ISO memiliki laporan serta audit number sendiri yang perlu dipertahankan.

### 5.4 Status dan kriteria tidak boleh ditebak

`Not reached at height of interest` adalah informasi bahwa tingkat tertentu tidak tercapai pada tinggi yang dievaluasi; itu berbeda dari hasil nol di seluruh ruang atau model yang tidak berlaku. `Not Applicable` untuk pool fire juga tidak sama dengan radius pool fire nol.

Dokumen menyebut batas IDLH dalam uraian toksisitas, tetapi IDLH tidak boleh dimaknai sebagai konsentrasi fatalitas deterministik. Kriteria historis, durasi, model kerentanan, serta metric impairment perlu dipertahankan konteksnya dan diverifikasi sebelum menjadi aturan produk.

## 6. Pengaruh terhadap konsep perbaikan dan kebutuhan CFD

Referensi ini memperkuat kebutuhan pemisahan model berikut:

```text
accidental release:
  inventori/upstream + lubang + isolasi/blowdown
    -> discharge source terhadap waktu
    -> jet fire / dispersi / flash fire / explosion sesuai cabang kejadian
    -> nilai receptor dan contour
    -> frekuensi impairment bila modul frekuensi diaktifkan

elevated flare:
  kondisi di tip + geometri flare + status penyalaan
    -> model flare yang sesuai
    -> nilai receptor dan contour
```

Kondisi proses, ukuran kebocoran, dan sumber berkecepatan tinggi pada kasus jet fire tidak boleh diganti secara langsung dengan kondisi tip flare. Demikian juga model dispersi TOX 2023 dan model accidental release FERA 2026 bukan satu kasus yang hanya berbeda versi software.

Untuk sasaran mereproduksi keluaran numerik FERA ini, **CFD tidak menjadi prasyarat berdasarkan bukti yang tersedia**: lampiran yang ditinjau secara eksplisit melaporkan hasil non-CFD. Akan tetapi, non-CFD di sini tetap memakai model rekayasa lebih lengkap daripada Gaussian pasif tetap dan radiasi titik tanpa source/flame model yang sesuai.

Prioritasnya adalah source/discharge, model api yang cocok, dispersi integral sesuai domain, definisi metric, serta validasi. CFD dapat menjadi studi khusus jika bangunan, recirculation, terrain atau interaksi sumber berpengaruh terhadap keputusan dan tidak terwakili model yang dipilih. Pernyataan non-CFD tersebut tidak membuktikan semua model sederhana sudah cukup akurat untuk semua kondisi lapangan.

## 7. Langkah penggunaan berikutnya

1. Jadikan dokumen ini reference map untuk memilih beberapa kasus yang sederhana dan relevan, bukan langsung mengimpor seluruh hasil sebagai golden test.
2. Pisahkan kasus accidental-release FERA dari flare performance dan exhaust TOX pada katalog benchmark.
3. Pilih satu ISO, satu fase yang telah dikonfirmasi, satu ukuran kebocoran, dan satu cuaca. Ikat input upstream, expanded source, model konsekuensi, tingkat radiasi/konsentrasi, tinggi evaluasi, waktu, serta audit number.
4. Mulai dari pengujian konsekuensi dengan sumber keluar yang diimpor jika source solver belum siap; catat keterbatasan tingkat kesiapan itu.
5. Rekonsiliasi roughness dan angka yang berbeda sebelum menentukan hasil penerimaan. Untuk angka yang terpecah, cukup minta halaman/ekspor spesifik yang diperlukan; tidak harus menunggu semua gambar tersedia.
6. Gunakan gambar ketika memverifikasi layout, orientasi contour, dan detail event tree. Ketidaktersediaannya tidak menghalangi perbaikan satuan, skema data, source contract, dan banyak pemeriksaan numerik.
