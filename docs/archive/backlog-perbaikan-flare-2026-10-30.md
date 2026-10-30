> Arsip historis sebelum pemilihan Python/backend dan cakupan penuh FERA–TOX. Spesifikasi aktif ada di [dokumen induk](../spesifikasi-sistem-fera-tox.md). Tautan relatif disesuaikan dengan lokasi arsip; isi keputusan lama bukan arahan runtime terkini.

# Backlog implementasi perbaikan flare

Dokumen pendamping [konsep detail](./konsep-perbaikan-flare-2026-10-30.md). Semua pekerjaan di bawah masih berupa rencana. P0 berarti integritas keluaran wajib dibenahi sebelum hasil diterima; P1 membentuk prediksi radiasi yang dapat diuji; P2 memperluas model dan domain setelah fondasi tersedia.

## 1. Urutan paket kerja

| Paket | Prioritas dan dependensi | Pekerjaan | Hasil yang diserahkan |
| --- | --- | --- | --- |
| WP-00 | P0; awal | Tetapkan domain gas flare, mode performance/sizing, sumber tip diketahui, satuan, arti receptor/criteria, model PHAST target, dan katalog referensi yang masih diperlukan | Spesifikasi basis model dan kartu benchmark tanpa default ambigu |
| WP-01 | P0; WP-00 | Rancang skema versi baru, status run/modul/criteria, unit converters, validator, dan input snapshot | Kontrak runtime yang menolak input tidak finite, basis tidak diketahui, atau mode tidak didukung |
| WP-02 | P0; WP-01 | Tutup bug energi inert/no ignition, flow nol, PASS default, tabel berbasis indeks, CSV berbeda jarak, hasil kedaluwarsa; tangani LFL/IDLH/noise lama | Hasil yang benar maknanya, atau status belum dinilai/parsial bila model belum tersedia |
| WP-03 | P1; WP-01 | Properti komponen/campuran, konversi basis LHV, MW aktual, densitas, gamma/Z dan provenance | Modul properti yang lulus contoh campuran serta unit independen |
| WP-04 | P1; WP-03 | Known-tip source state, performance, sizing awal; pemisahan header/tip dan diagnosis sumber di luar domain | State sumber dan intermediate quantities yang bisa diaudit |
| WP-05 | P1; WP-02,04 | Evaluator sumber titik dengan geometri diketahui, energi konsisten, orientasi receiver, transmisi eksplisit | Baseline radiasi yang lulus kasus analitik |
| WP-06 | P1; WP-05 dan referensi | Verifikasi/pilih korelasi flame geometry dan parameter pembakaran untuk domain target | Model prediktif bernomor versi beserta bukti verifikasinya |
| WP-07 | P1; WP-05 | Koordinat, receptor, sampling kurva, contour extraction, domain expansion, criterion assessment | Field dan extent yang konsisten, berstatus jelas bila belum konvergen |
| WP-08 | P1; WP-02,07 | Integrasi UI, snapshot run, worker bila perlu, migrasi file lama, ekspor dan perbandingan run | Alur input–run–hasil–ubah input–stale–run baru–ekspor yang utuh |
| WP-09 | P1; desain sejak WP-00, eksekusi setelah WP-06,08 | Dataset PHAST yang cocok, intermediate comparison, sensitivitas, kasus holdout | Laporan error per metric/domain dan batas penggunaan yang diterima |
| WP-10 | P2; WP-04,06,08 | Known-tip time history, ignition breakpoint, integrasi massa/dose, peak dan envelope waktu | Blowdown quasi-steady dengan asumsi serta validasi waktu yang jelas |
| WP-11 | P2; WP-01,04,07,08 | Model dispersi yang sesuai, endpoint flammability/toksisitas per spesies, satu evaluator peta/receptor | Modul dispersi dengan benchmark serta domain tersendiri |
| WP-12 | P2; WP-01,04,07,08 | Source sound power, spektrum/weighting, geometri propagasi, kriteria noise dan benchmark vendor/pengukuran | Modul noise dengan sumber dan hasil yang dapat ditelusuri |
| WP-13 | Perluasan lingkup; konsekuensi tervalidasi | Frekuensi, event tree, probabilitas, cuaca, kerentanan, occupancy/populasi, agregasi risiko | Metric risiko yang didefinisikan dan diuji terpisah dari contour konsekuensi |

WP-05 dapat mulai dengan geometri diketahui tanpa menunggu korelasi WP-06. Namun kemampuan prediksi flare belum selesai sampai WP-06 dan validasinya tersedia. Uji benchmark dirancang di awal dan diulang pada perubahan yang memengaruhi model; WP-09 tidak berarti menunda semua pengujian sampai akhir.

## 2. Checklist paket pertama

- [ ] Simpan fixture input lama yang mereproduksi gas inert, flameout, flow nol, pemetaan tabel salah, dan jarak CSV yang salah. Catat bahwa keluaran lama merupakan bukti defect, bukan hasil acuan yang harus dipertahankan.
- [ ] Definisikan kondisi no ignition dan LHV nol sebagai keadaan fisik, serta properti yang hilang sebagai data belum lengkap.
- [ ] Bedakan `not_assessed` dari nilai nol dan `within_criterion`; singkirkan PASS konstan.
- [ ] Definisikan satuan dan reference condition untuk setiap field yang melewati batas UI/engine/file.
- [ ] Tentukan satu sumber kebenaran active scenario dan satu current run per draft, dengan snapshot hasil lama tetap tersedia sebagai arsip.
- [ ] Ubah pemetaan tabel dari posisi array menjadi ID kriteria.
- [ ] Gunakan format ekspor dengan koordinat setiap nilai; hentikan penggabungan array berdasarkan indeks.
- [ ] Tambahkan input hash dan aturan stale, termasuk bila receptor, kriteria, atau versi model berubah.
- [ ] Koreksi unit konsentrasi jika modul dispersi dipertahankan; IDLH berbasis LFL harus diganti endpoint yang sah atau status belum dinilai.
- [ ] Modul noise/dispersi yang belum dapat diperbaiki diberi status yang benar, disertai ringkasan parsial. Jangan menghilangkannya diam-diam dari cakupan studi.
- [ ] Pastikan semua panel dan ekspor tidak menghasilkan NaN, Infinity, atau null yang kehilangan makna fisiknya.

## 3. Kriteria penerimaan yang dapat dijadikan uji

| ID | Kasus dan hasil yang diharapkan | Paket |
| --- | --- | --- |
| AC-01 | Nitrogen murni mempunyai energi pembakaran aliran utama nol; missing LHV tidak berubah menjadi default natural gas | WP-02,03 |
| AC-02 | Flameout tanpa penyalaan berikutnya tidak menghasilkan api utama; permintaan dispersi diteruskan ke model yang sesuai atau diberi status belum didukung | WP-02 |
| AC-03 | Flow nol menghasilkan kontribusi sumber nol/tidak aktif dan state finite yang terdefinisi; tidak ada `-Infinity` pada noise atau ringkasan | WP-02 |
| AC-04 | Kasus analitik pada dokumen menghasilkan energy budget, densitas, kecepatan, Mach, dan fluks yang sesuai | WP-03,04,05 |
| AC-05 | MW berasal dari komposisi; kenaikan suhu dalam kelvin memengaruhi kecepatan suara menurut baseline yang dipilih, tanpa suhu rasio ganda | WP-03,04 |
| AC-06 | Pada tau tetap dan orientasi normal, melipatgandakan jarak sebenarnya dari titik radiasi menghasilkan seperempat fluks | WP-05 |
| AC-07 | Rotasi sumber/angin dan receptor secara konsisten memberi hasil ekuivalen; arah angin asal utara memberi downwind ke selatan | WP-07 |
| AC-08 | Contour analitik berpusat pada proyeksi pusat radiasi; radius contour dan extent dari base dibedakan | WP-07 |
| AC-09 | Receptor, sampling kurva, peta dan ekspor pada koordinat/waktu yang sama cocok dengan evaluator; error interpolasi dinyatakan | WP-07,08 |
| AC-10 | Setiap nilai noise/radiasi CSV membawa jarak atau x/y/z yang benar walaupun grid sumber berbeda | WP-02,08 |
| AC-11 | Perubahan input fisik menandai run lama stale; laporan run lama tetap mencetak input snapshot lama | WP-02,08 |
| AC-12 | Semua kriteria, termasuk dua kriteria dengan threshold sama, mempunyai baris/hasil yang benar tanpa bergantung pada urutan object | WP-02,07 |
| AC-13 | Domain yang terlalu kecil menghasilkan `truncated`; solver yang belum konvergen menghasilkan `unresolved`; keduanya tidak ditampilkan sebagai aman | WP-07 |
| AC-14 | Input nol yang sah, RH 0%, suhu 0°C, dan arah 0° tidak diganti default oleh parser UI | WP-01,08 |
| AC-15 | Komposisi negatif/duplikat/tidak dikenal, angka nonfinite, dan T/P tidak sah ditolak dengan diagnosis field | WP-01,03 |
| AC-16 | Migrasi file lama tidak menebak basis header/tip dan tidak mengonversi satuan dua kali; ID active scenario valid setelah buka/hapus skenario | WP-08 |
| AC-17 | Hasil worker yang selesai setelah draft berubah tidak menggantikan current run draft baru | WP-08 |
| AC-18 | Time history pada interval tidak seragam terintegrasi dengan interval sebenarnya; ignition breakpoint memisahkan keadaan fisik | WP-10 |
| AC-19 | 2,5 vol% dengan MW metana 16,043 pada 25°C, 1 atm memberi sekitar 16.403,885 mg/m³; nilai ini menguji konversi, bukan LFL metana aktual | WP-02,11 |
| AC-20 | Konsentrasi spesies memakai fraksi massa yang sesuai; IDLH tidak mengikuti perubahan LFL | WP-11 |
| AC-21 | Penjumlahan noise dilakukan dalam energi; dua kontribusi level identik memberi kenaikan sekitar 3,0103 dB | WP-12 |
| AC-22 | Kasus tanpa crossing atau nilai acuan mendekati nol tidak menyebabkan pembagian nol pada laporan error benchmark | WP-09 |

Angka acuan tidak diambil dari hasil engine baru yang sama lalu dipakai untuk membuktikan engine tersebut. Gunakan contoh analitik, sumber properti yang independen, atau keluaran pembanding dengan metadata yang dapat ditelusuri.

## 4. Definisi selesai per rilis

**Rilis integritas:** WP-00–02 selesai. Keluaran lama yang belum dibenahi dibatasi dengan status belum didukung/belum dinilai. Ini belum berarti model radiasi prediktif telah tervalidasi.

**Rilis perhitungan radiasi dengan sumber/geometri diketahui:** WP-03–05,07–08 selesai pada domain tersebut; contoh analitik dan uji integrasi lulus. Model sumber dan geometri yang diimpor tercatat sebagai asumsi/data eksternal.

**Rilis prediksi flare pada domain target:** WP-06 dan WP-09 selesai. Korelasi, rentang penggunaan, benchmark, toleransi dan selisih yang tersisa didokumentasikan. Tidak ada klaim kesetaraan dengan seluruh PHAST/SAFETI.

**Rilis transien/dispersi/noise:** tiap modul mempunyai acceptance dan validasi sendiri; penyelesaiannya tidak disimpulkan dari kelulusan modul radiasi.

## 5. Referensi dan keputusan yang masih perlu dipastikan

| Kebutuhan | Mengapa diperlukan | Tahap yang bergantung |
| --- | --- | --- |
| Edisi dan persamaan korelasi flare yang dipilih | Mengikat koefisien pada satuan serta domain yang benar | WP-06 |
| Property dataset dan basis LHV | Memastikan komposisi, energi dan source state konsisten | WP-03,04 |
| Technical reference dan ekspor kasus PHAST yang sebanding | Mengetahui model, default, receiver, dan definisi keluaran pembanding | WP-09 |
| Basis kriteria lokasi/standar/perusahaan | Menentukan konteks threshold, durasi, dan penilaian receptor | WP-07,08 |
| Endpoint toksisitas dan model dispersi | Menentukan spesies, averaging time serta domain gas | WP-11 |
| Data sumber kebisingan dan metode propagasi | Memisahkan Lw sumber dari Lp receptor dan periode penilaian | WP-12 |
| Frekuensi, probabilitas, populasi, dan vulnerability | Dibutuhkan hanya bila scope diperluas ke risiko | WP-13 |

Item yang belum tersedia tidak menghalangi koreksi integritas, kontrak satuan, atau baseline analitik. Item itu tetap menjadi prasyarat untuk klaim kemampuan model yang bergantung padanya.

## 6. Tambahan setelah referensi TOX diterima

Rincian sumber terdapat pada [telaah referensi TOX](../telaah-referensi-phast-tox-2023.md). Tambahkan pekerjaan berikut ke WP-00, WP-09 dan WP-11 jika studi TOX menjadi cakupan aplikasi:

- [ ] Bedakan sumber elevated flare, thermal-oxidizer exhaust, dan acid-gas vent.
- [ ] Rekonsiliasi HMB, basis MMSCFD, komposisi/MW, serta kolom massa spesies pada tabel sumber.
- [ ] Verifikasi metadata PHAST 8.4, model sumber/dispersion, serta averaging Toxic 600 s versus Flammable 18,75 s sebelum perbandingan toksik.
- [ ] Simpan 57 hasil yang diekstrak sebagai `reported_requires_reconciliation`; jangan menjadikannya golden test sebelum input dan metric jelas.
- [ ] Tambahkan metric extent kontur pada berbagai ketinggian dan konsentrasi receptor pada z tertentu secara terpisah.
- [ ] Tetapkan model momentum/buoyancy/plume rise dan penanganan campuran lebih berat dari udara sesuai domainnya.
- [ ] Verifikasi label serta sumber endpoint historis tanpa mengubah angka threshold secara diam-diam.
- [ ] Telaah FERA ketika versi file di bawah batas transfer tersedia; jangan menebak parameter atau hasilnya dari nama dokumen.

## 7. Tambahan setelah Markdown FERA berhasil dibaca

Lihat [telaah FERA 2026](../telaah-referensi-fera-2026.md). Akses awal dan pemetaan model sudah dilakukan; verifikasi seluruh angka dan gambar belum selesai.

- [ ] Pisahkan katalog kasus accidental-release PHAST 9.0 dari elevated flare dan exhaust TOX PHAST 8.4.
- [ ] Buat benchmark bertingkat: upstream/inventori ke expanded discharge, kemudian known discharge ke konsekuensi.
- [ ] Catat UDM dan TNO Multi-Energy sebagai model yang dinyatakan sumber, tanpa menganggap uraian ringkas cukup untuk mereplikasi algoritmenya.
- [ ] Ikat threshold, height of interest, averaging, waktu, audit number dan override studi pada setiap fixture.
- [ ] Rekonsiliasi roughness 0,001 m versus 0,3 m dan angka laju/durasi yang berbeda antara ringkasan dan lampiran.
- [ ] Pertahankan `not reached at height of interest`, `not applicable`, dan hasil yang belum terverifikasi sebagai keadaan berbeda.
- [ ] Gunakan ekspor numerik/halaman PDF terpilih untuk memulihkan tabel yang terpecah; tambahkan gambar saat memeriksa layout, contour dan node event tree.
- [ ] Perlakukan hasil impairment frequency sebagai metric tersendiri; jangan mengubah threshold risiko studi ini menjadi kriteria universal.
