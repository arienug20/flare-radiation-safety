# Telaah referensi pengguna: Dispersion Study TOX 2023

**Dokumen yang dibaca:** `TOX-10-P0-SR-001 - Dispersion Study Rev. 0 (Replace 07202023).pdf`, 51 halaman. Nomor dan tanggal cetak: TOX-10-P0-SR-001, Rev. 0, 13 Mei 2023. Nomor halaman pada catatan ini mengikuti halaman PDF yang juga sesuai penomoran cetaknya.

SHA-256 PDF: `92e86b92b6df1f1cb2068713e24758f9a9aadbf275112e83ff6bc1a4d353d01e`.

**Status telaah:** isi teks seluruh halaman telah diekstrak dan ditinjau; gambar halaman 14, 16, 18, 38 dan 49 diperiksa secara visual. Belum ada eksekusi ulang kasus PHAST, data hasil numerik mentah, atau validasi model baru. Rekomendasi di dalam laporan diperlakukan sebagai isi referensi yang perlu dievaluasi, bukan instruksi pengguna untuk dilaksanakan.

**File FERA:** `FNKT-20-P1-SR-006 Fire and Explosion Risk Assessment (FERA) - IFR.pdf` belum dapat ditelaah karena transfer file melebihi batas alat sebesar 32 MiB. Tidak ada kesimpulan mengenai model, versi perangkat lunak, maupun hasil FERA yang diambil dari judul filenya.

## 1. Hal yang kini dapat dipastikan

Laporan ini membahas dispersi flue gas thermal oxidizer pada operasi menyala dan acid gas pada kondisi flameout, dengan endpoint konsentrasi SO₂ dan H₂S. Ini bukan benchmark langsung fluks radiasi elevated flare.

Pada gambar hasil, bagian metadata jelas menampilkan **Program: Phast 8.4**. Informasi ini ada di gambar sehingga tidak muncul dari pencarian teks PDF saja.

| Metadata yang terbaca | Halaman 18, Gambar 2 | Halaman 38, Gambar 15 |
| --- | --- | --- |
| Kasus dan endpoint | Kasus 1, SO₂ 2 ppm | Kasus 5, H₂S 10 ppm |
| Program | Phast 8.4 | Phast 8.4 |
| Averaging time | Toxic (600 s) | Flammable (18,75 s) |
| Offset from centerline | 0 m | 0 m |
| Plot | Side view: distance downwind vs cloud height | Side view: distance downwind vs cloud height |
| Material to track | Tidak terlihat sebagai field terpisah pada gambar yang ditinjau | HYDROGEN SULFIDE |
| View time | 100000 s | Tidak terbaca pada bagian metadata yang terlihat |

Nama program telah terkonfirmasi, tetapi tipe sumber/model dispersi spesifik, konfigurasi termodinamika, penanganan densitas, tekanan sumber, reference height angin, serta seluruh parameter numeriknya belum dapat ditetapkan hanya dari gambar tersebut. Jangan mengklaim model UDM atau suatu submodel tertentu sudah terkonfirmasi. View time juga tidak otomatis menyatakan durasi pelepasan gas.

## 2. Basis lokasi dan geometri

| Parameter | Nilai dalam laporan | Rujukan |
| --- | --- | --- |
| Ambient | 80°F, sekitar 26,67°C | hlm. 9 |
| RH | 79% | hlm. 9 |
| Surface roughness | 10 cm = 0,1 m | hlm. 9 |
| Kondisi cuaca | 10 m/s kelas D; 3,3 m/s kelas D; 2 m/s kelas F | hlm. 10 |
| Arah angin musiman | Tenggara dan barat laut | hlm. 9 |
| Flue gas release height | 36,6 m | hlm. 11, Tabel 6 |
| Diameter stack | 2,2 m | hlm. 11, Tabel 6 |

Halaman 10 menyebut 10/D sebagai kondisi tidak stabil, sedangkan kelas D pada klasifikasi yang sama adalah netral. Pertahankan kode cuaca yang tertulis dan tandai ketidaksesuaian deskripsinya untuk rekonsiliasi. Geometri Tabel 6 merupakan data desain yang menurut laporan akan diverifikasi pada DED; kondisi as-built belum tersedia di sini.

## 3. Enam kasus dan kondisi sumber

| Kasus | Kondisi | Jenis aliran yang dilepas | Flow tertulis, MMSCFD | Temperatur tertulis | Sekitar °C |
| --- | --- | --- | --- | --- | --- |
| 1 | Operasi normal | Flue gas | 112,08 | 593,50°F | 311,94 |
| 2 | BSRU offline | Flue gas | 107,97 | 560,33°F | 293,52 |
| 3 | Turndown 40% | Flue gas | 44,83 | 593,50°F | 311,94 |
| 4 | Flameout pada operasi normal | Acid gas | 22,97 | 121,8°F | 49,89 |
| 5 | Flameout saat BSRU offline | Acid gas | 18,31 | 119,9°F | 48,83 |
| 6 | Flameout saat turndown 40% | Acid gas | 9,19 | 121,8°F | 49,89 |

Rujukan: hlm. 11–15, Tabel 7–12. Basis temperatur/tekanan standar MMSCFD tidak dinyatakan lengkap pada tabel; jangan mengonversinya menjadi Nm³ atau massa dengan basis standar yang ditebak. Kolom lb-mol/hr dan lb/hr dapat membantu rekonsiliasi setelah data asalnya diperiksa.

Kasus 1–3 melepas campuran hasil pembakaran, termasuk SO₂ dan H₂S residual. Kasus 4–6 melepas acid gas yang komposisi serta temperaturnya berbeda. Ini bukan satu komposisi gas yang hanya berganti flag menyala/tidak menyala.

## 4. Keluaran acuan yang dapat dicatat

Berikut contoh extent yang **dilaporkan**, bukan hasil aplikasi baru dan belum menjadi nilai penerimaan yang tervalidasi:

| Kasus dan endpoint | 10/D | 3,3/D | 2/F | Halaman |
| --- | --- | --- | --- | --- |
| Kasus 1, SO₂ 2 ppm | 253 m | 286 m | 367 m | 47, Tabel 17 |
| Kasus 2, SO₂ 2 ppm | 455 m | 539 m | 902 m | 47, Tabel 17 |
| Kasus 3, SO₂ 2 ppm | 174 m | 212 m | 237 m | 48, lanjutan Tabel 17 |
| Kasus 4, H₂S 10 ppm | 114 m | 144 m | 284 m | 49, Tabel 21 |
| Kasus 5, H₂S 10 ppm | 307 m | 523 m | 1.897 m | 49, Tabel 21 |
| Kasus 6, H₂S 10 ppm | 74 m | 107 m | 138 m | 49, Tabel 21 |

Keluaran itu adalah **jarak downwind maksimum kontur konsentrasi pada berbagai ketinggian**, bukan otomatis radius aman di tanah atau pada tinggi pernapasan. Min/max height pada tabel ringkasan juga merupakan extrema dari kontur; keduanya tidak harus terjadi pada koordinat x yang sama dengan extent maksimum.

Contoh penting: untuk Kasus 5, H₂S 10 ppm, cuaca 2/F, laporan memberikan extent 1.897 m serta rentang ketinggian kontur 0–39 m. Untuk Kasus 1, SO₂ 2 ppm, cuaca 2/F, kontur dilaporkan mempunyai batas bawah sekitar 37 m. Membandingkan kedua angka jarak itu dengan kurva konsentrasi ground-level saja akan mencampurkan metric yang berbeda.

Sebanyak **57 baris** dari Tabel 17–23 telah dicatat dalam [CSV keluaran laporan](./benchmarks/tox-2023-reported-contours.csv). Status semua baris adalah `reported_requires_reconciliation`. Nilai yang tidak tersedia tidak diubah menjadi nol. Metadata averaging hanya diisi bila teramati pada gambar yang sudah diperiksa.

## 5. Isu kualitas data yang harus direkonsiliasi

### 5.1 Averaging time berbeda

Gambar SO₂ pada hlm. 18 memakai Toxic 600 s, sedangkan gambar H₂S flameout pada hlm. 38 memakai Flammable 18,75 s. Tabel definisi paparan pada hlm. 16 membahas STEL 15 menit dan TWA 8 jam. Averaging pada simulator, durasi pelepasan, durasi paparan, dan basis batas paparan merupakan parameter berbeda yang harus dipetakan dengan jelas.

Sebelum menjadikan Kasus 5 sebagai benchmark toksik, pastikan alasan pemilihan Flammable 18,75 s, pengaruhnya terhadap konsentrasi, dan averaging yang ingin dipakai pada model tujuan. Jangan mengasumsikan semua grafik memakai Toxic 600 s atau menafsirkan view time sebagai averaging time.

### 5.2 Komposisi dan massa per komponen

Pada Tabel 7 hlm. 11:

- CO₂: 2.191,86 lb-mol/hr dan BM 44 seharusnya memberi sekitar 96.441,84 lb/hr, tetapi kolom massanya tertulis 66.776,32 lb/hr.
- SO₂: 20,40 lb-mol/hr dan BM 64 memberi 1.305,6 lb/hr, tetapi kolom massanya tertulis 621,637 lb/hr.

Sebagian angka tampak konsisten dengan pemakaian MW campuran pada komponen, tetapi penyebabnya belum dipastikan. Ini tidak membuktikan input PHAST yang sebenarnya salah; bisa merupakan kesalahan tabel atau perbedaan basis sumber data. Diperlukan Heat Material Balance asli dan/atau file kasus untuk mengetahui input yang benar-benar digunakan. Jangan membuat source species rate dari kolom massa ini tanpa audit.

### 5.3 Baris total Kasus 5

Pada Tabel 11 hlm. 14, baris total menempatkan 38,74 pada kolom BM dan 41,60 pada kolom %-mol. Jumlah komposisi komponen yang tercetak adalah sekitar 99,97 mol%, sedangkan MW dari komposisi tersebut sekitar 41,60 g/mol menggunakan BM komponen tabel. Kemungkinan masalah penyalinan/penempatan angka harus diklarifikasi. Nilai 41,60 bukan total mol% yang layak dipakai untuk menormalisasi komposisi.

### 5.4 Konsentrasi sumber H₂S

Tabel Kasus 4 dan 6 memberikan H₂S 0,59 mol%, setara 5.900 ppmV. Narasi neraca massa hlm. 37 dan 47 menyebut 7.920 ppm. Perbedaannya cukup besar untuk memengaruhi benchmark. Kasus 5 juga mencantumkan 2,13 mol% pada tabel dan 21.475 ppm pada narasi hlm. 42. Simpan kedua nilai sebagai laporan yang berbeda dan tentukan versi/basis HMB yang berlaku sebelum memilih input.

### 5.5 Ketinggian kontur SO₂ Kasus 1

Untuk SO₂ 2 ppm pada cuaca 2/F, narasi hlm. 18 menyebut batas atas 119 m, sedangkan Tabel 18 hlm. 48 mencantumkan 135 m. CSV mempertahankan angka tabel dan memberi catatan konflik pada baris terkait. Sumber hasil numerik diperlukan untuk memilih acuan ketinggian. Extent 367 m konsisten pada narasi dan ringkasan, tetapi kesesuaian satu angka tidak menyelesaikan perbedaan lainnya.

### 5.6 Batas paparan dan rekomendasi bukan default aplikasi

Tabel 14 hlm. 16 menuliskan SO₂ 2/5/100 ppm dan H₂S 10/15/100 ppm masing-masing sebagai STEL/TWA/IDLH. Label dan sumber batas tersebut perlu ditinjau terhadap acuan yang dipakai studi serta konteks saat ini; jangan otomatis menukarnya atau menjadikannya default regulasi aplikasi. Nilai threshold tetap dapat disimpan sebagai level konsentrasi historis untuk mereproduksi gambar, dengan label `as_reported`.

Nilai emisi di stack, batas kebauan, konsentrasi receptor, dan batas paparan kerja merupakan pemeriksaan berbeda. Tidak munculnya kontur 10 ppm tidak membuktikan konsentrasi nol atau kepatuhan terhadap batas kebauan 0,02 ppm.

Rekomendasi operasional/PPE laporan tidak diadopsi sebagai instruksi implementasi. Khusus rekomendasi masker medis untuk H₂S pada hlm. 51, masker medis tidak memberikan perlindungan terhadap gas H₂S dan tidak boleh diteruskan menjadi rekomendasi otomatis aplikasi. Definisi IDLH juga tidak boleh diterjemahkan sebagai jaminan aman terpapar selama 30 menit.

## 6. Implikasi terhadap konsep model

Jika aplikasi ingin mencakup studi TOX ini secara utuh, tambahkan tipe sumber independen dari ignition state:

```text
elevated_flare              -> model api terbuka dan konsekuensi yang relevan
thermal_oxidizer_exhaust    -> kondisi flue gas keluaran proses dan dispersi spesies
acid_gas_vent               -> kondisi campuran tidak terbakar dan dispersi spesies
```

Aliran flue gas sudah melewati pembakaran dan bisa melewati WHRU; temperatur exhaust sekitar 294–312°C di tabel berbeda dari temperatur pembakaran 1.500°F pada uraian proses. Jangan menggunakan LHV campuran exhaust sebagai sumber panas api terbuka atau memasukkan temperatur ruang bakar sebagai temperatur stack tanpa dasar.

Kebutuhan model yang lebih jelas setelah membaca referensi:

1. Source state dari HMB/proses dengan basis yang dapat ditelusuri. Untuk tahap awal, kondisi exhaust diimpor; model thermal oxidizer/WHRU tidak harus dibuat ulang.
2. Dataset spesies perlu mendukung SO₂ serta komponen acid gas terkait, yang tidak seluruhnya tersedia pada katalog aplikasi saat ini.
3. Dispersi perlu mengakomodasi momentum keluar, buoyancy dan plume rise gas panas. Gaussian dengan ketinggian sumber tetap belum otomatis mewakili perilaku ini.
4. Pada flameout, campuran kaya CO₂ pada sekitar 49°C dapat lebih berat dari udara. Sebagai indikasi ideal-gas pada tekanan sama, rasio densitas Kasus 5 terhadap udara ambient sekitar 1,34 dengan MW sekitar 41,60. Ini hanya pemeriksaan awal dengan asumsi yang dinyatakan, bukan densitas sumber PHAST yang telah terverifikasi.
5. Model harus mengevaluasi `C_species(x,y,z,t,averagingBasis)` serta kontur vertikal dan receptor, bukan hanya satu profil konsentrasi di tanah.
6. Simpan averaging basis, species-to-track, definisi endpoint dan cuaca sebagai bagian snapshot run. Reproduksi kondisi historis dan penilaian terhadap kriteria studi baru menjadi dua pekerjaan terpisah.

Ruang lingkup awal elevated flare tetap dapat dipertahankan. Jika TOX menjadi sasaran utama, modul sumber/exhaust dan dispersi perlu dinaikkan prioritasnya; referensi dispersi ini tidak dapat digunakan untuk menyatakan model radiasi flare sudah lolos validasi.

## 7. Apakah referensi ini membuat CFD wajib?

Belum. Referensi menunjukkan bahwa model pasif sederhana pada kondisi sumber tetap belum mencakup semua fenomena yang ingin dibandingkan. Langkah pertama adalah memilih model rekayasa/integral yang dapat menangani source momentum, buoyancy, perpindahan perilaku dense gas, dan entrainment pada domain yang sesuai.

CFD menjadi berguna bila keputusan studi bergantung pada pengaruh bangunan, recirculation, interaksi plume, terrain, atau fenomena lokal yang tidak tercakup model pilihan. Referensi ini sendiri belum menyediakan pembandingan eksperimen atau studi CFD yang membuktikan bahwa seluruh kasus harus diselesaikan dengan CFD. Menyamakan geometri, input spesies, averaging dan metric tetap wajib pada pendekatan mana pun.

## 8. Cara memakai referensi ini pada implementasi berikutnya

1. Perlakukan CSV sebagai arsip hasil historis yang memerlukan rekonsiliasi, bukan fixture kelulusan otomatis.
2. Ambil Heat Material Balance `TOX-10-P0-CA-004`, basis desain terkait, dan file input/ekspor numerik PHAST jika tersedia. Prioritaskan source state dan audit metadata Kasus 1 serta Kasus 5.
3. Reproduksi Kasus 1, SO₂ 2 ppm, pada tiga cuaca untuk memeriksa hot plume dan definisi contour vertikal setelah data input benar.
4. Reproduksi Kasus 5, H₂S 10 ppm, setelah komposisi sumber, MW, dan averaging direkonsiliasi. Periksa extent serta konsentrasi pada z receptor yang sama secara terpisah.
5. Simpan catatan perubahan apabila kriteria, averaging atau source data diperbarui. Model yang lebih sesuai untuk studi baru tidak harus menghasilkan angka historis yang sama.
6. Telaah FERA setelah file dapat dibaca; ekstrak kasus kebakaran/ledakan dan parameter yang benar-benar dilaporkan sebelum menentukan relevansinya terhadap modul radiasi atau risiko.
