# Backlog implementasi sistem FERA–TOX

**Versi:** 31 Oktober 2026. Pendamping [spesifikasi authoritative](./spesifikasi-sistem-fera-tox.md). Paket di bawah adalah pekerjaan aplikasi berikutnya; pembuatan dokumentasi ini tidak menandakan backend atau model sudah diimplementasikan.

Prioritas: **P0** integritas kontrak/hasil; **P1** platform dan model inti; **P2** perluasan domain ilmiah. Cakupan seluruh FERA/TOX sudah dipilih, sehingga paket impairment bukan lagi sekadar opsi pada rencana awal. Individual risk/F–N dan CFD tetap memerlukan perluasan spesifikasi tersendiri.

## 1. Paket, dependensi, keluaran dan acceptance

| Paket | Prioritas; dependensi | Pekerjaan dan keluaran konkret | Acceptance |
| --- | --- | --- | --- |
| WP-00 — Spesifikasi induk | P0; awal | Satukan keputusan, source kinds, domain, model readiness, kontrak API/data/job/UI dan referensi. Dokumentasi tersedia; penyelesaian dependensi ilmiah tetap dicatat | Checklist bagian 5 |
| WP-01 — Domain dan SI | P0; WP-00 | Pydantic schema v2, unit/basis, coordinate frame, status/diagnosis, canonical hash dan OpenAPI contracts | AC-14,15,35,44 |
| WP-02 — Integritas dan legacy | P0; WP-01,15,17,18 | Tutup false fire/PASS, salah tabel/CSV, stale dan zero/unknown; import legacy non-destructive; hentikan browser engine sebagai sumber hasil authoritative | AC-01,02,03,10,11,12,16,19,43 |
| WP-03 — Properti | P1; WP-01 | Adapter thermo/ideal/PR, dataset/BIP/pseudo-component provenance, phase/flash dan mass-energy validation | AC-04,05,15,35 |
| WP-04 — Source dan discharge | P1; WP-03 | Known-tip performance/sizing, upstream/throat/expanded state, gas/liquid/HEM sesuai readiness; contoh source independen | AC-04,05,36,44 |
| WP-05 — Baseline radiasi | P1; WP-04 | Energi dan point-source evaluator geometri diketahui, orientasi/transmisi eksplisit; fixture analitik lengkap | AC-01–06,08 |
| WP-06 — Prediksi geometri api | P1; WP-03,04,05 dan referensi primer | Korelasi flame/SEP/transmission versi sah untuk domain flare/jet yang dipilih; validation evidence sebelum aktivasi | AC-06,07,13,44 serta benchmark per model |
| WP-07 — Geometry dan criteria | P1; WP-05 | Receptor, ENU/wind, field sampling, contour solver, domain/convergence, threshold/duration dan typed coverage | AC-07,08,09,12,13,40 |
| WP-08 — Vertical slice | P1; WP-05,07,14–18 | Buktikan save-revision-run-outbox-worker-result-map-export dengan satu kasus analitik dari UI | AC-04,09,11,26,31,41,42 |
| WP-09 — Benchmark | P1; desain sejak WP-00; eksekusi mengikuti modul terkait | Kartu kasus, source/metric reconciliation, holdout, PHAST error analysis dan per-fixture tolerances. Aktivasi domain baru bergantung hasilnya | AC-22,35–39,44 dan evidence manifest |
| WP-10 — Transien | P2; WP-04,16 | Inventory/species/energy ODE, imported history, event breakpoints, isolation/blowdown, peak/duration/dose | AC-18,36,40 |
| WP-11 — TOX/dispersi/toksik | P2; WP-03,04,07; WP-10 untuk history | Exhaust/acid-gas sources, integral/pasif/dense sesuai domain, species tracking, averaging, toxicity endpoints dan vertical field | AC-19,20,35,40,44 serta benchmark TOX/FERA |
| WP-12 — Noise | P2; WP-03,04,07 | Lw source/band data, propagation, weighting, receiver/time criteria dan vendor benchmark | AC-03,21,40,44 |
| WP-13 — Impairment | P2; consequence modules WP-06,10,11,19 yang diminta studi | Parts count/rate dataset, conditional event tree, weather-direction weights, hit/duration dan frequency decomposition | AC-39,40,44 |
| WP-14 — Persistence dan akun | P1; WP-01 | SQLAlchemy/Alembic, Postgres entities/revisions, membership, admin CLI, local sessions/CSRF dan immutable records | AC-23,24,34 |
| WP-15 — REST/OpenAPI | P1; WP-14 | Endpoint lengkap, error envelope, optimistic concurrency, idempotency records, preflight/model catalog dan generated TypeScript client | AC-24,26,32,40,43 |
| WP-16 — Worker dan outbox | P1; WP-15 | Celery/Redis dispatcher, atomic publication, leases/fencing, heartbeat, bounded retry/cancel/recovery dan artefak | AC-25–30,34 |
| WP-17 — Frontend konektivitas | P1; WP-07,15,16 | Zustand UI/draft, TanStack server state, autosave/flush, conflict handling, polling/reconnect, selection race dan authoritative charts | AC-09,11,14,17,24,26,31,41 |
| WP-18 — Export | P1; WP-15,16,17 | Snapshot-based receptor/field CSV, PDF, JSON, units/locale, partial labels dan authenticated artifact download | AC-10,30,34,40,42 |
| WP-19 — Flash/pool/VCE | P2; WP-07,10,11 dan referensi | Flammability basis/flash envelope, pool budgets/correlations, TNO curves/PED/strength dan overpressure; typed NA/domain failures | AC-35,37,38,40,44 |
| WP-20 — Docker dan operasi | P1; WP-14–18 | Nginx/HTTPS, Compose, migration/bucket init, secrets, health/version, observability dan backup/restore runbook | AC-25,28,30,32,33 |
| WP-21 — CI dan E2E | P1; WP-08,20; diperluas per modul | Contract/engine/UI tests, failure injection, restore drill dan regression fixtures independen; release checklist dengan bukti | AC-01–44 sesuai domain rilis |

Dependensi mencerminkan syarat penyelesaian paket; pekerjaan scaffolding/fixture dapat dimulai lebih awal. WP-09 dirancang sejak awal dan diverifikasi per model: implementasi model tidak harus menunggu semua model lain, tetapi status validated tidak diberikan sebelum benchmark/domain evidence model itu sendiri selesai. Ini menghindari dependensi melingkar antara implementasi dan validasi.

## 2. Acceptance matrix

AC-01–22 mempertahankan maksud kriteria awal; AC-23–44 menambahkan kontrak backend, konektivitas dan domain FERA/TOX. Angka golden tidak disalin dari engine yang sedang diuji.

| ID | Kasus dan bukti yang harus diserahkan |
| --- | --- |
| AC-01 | Inert murni tidak menghasilkan energi pembakaran; missing LHV menjadi diagnosis, bukan default bahan bakar |
| AC-02 | No ignition/flameout tidak menghasilkan nyala utama; dispersi/noise tetap mengikuti sumber dan readiness yang benar |
| AC-03 | Flow nol mempunyai kontribusi sumber nol/tidak aktif yang terdefinisi; tidak ada NaN/Infinity atau overall-safe fiktif |
| AC-04 | Seluruh 13 angka [fixture analitik](./contoh-kasus-analitik.json) cocok pada toleransi yang ditetapkan |
| AC-05 | MW dan sonic velocity memakai komposisi/suhu/phase model yang benar; performance dan sizing konsisten |
| AC-06 | Inverse-square pada true distance dan orientation/energy basis sesuai contoh independen |
| AC-07 | Transformasi angin/receptor konsisten; angin asal utara menuju selatan; rotasi sistem memberi hasil ekuivalen |
| AC-08 | Contour analitik offset mempunyai pusat, radius terhadap pusat dan extent terhadap base yang benar |
| AC-09 | Receptor/curve/map/CSV pada xyz/time yang sama cocok; interpolation error diketahui |
| AC-10 | Noise/radiasi dengan grid berbeda diekspor pada koordinat masing-masing; tidak digabung berdasarkan indeks |
| AC-11 | Input berubah membuat run lama stale; report run lama tetap memakai snapshot lama |
| AC-12 | Kriteria memakai ID stabil, termasuk threshold sama dengan konteks berbeda; tidak bergantung urutan object |
| AC-13 | Domain/solver belum cukup menghasilkan truncated/unresolved; tidak berubah menjadi radius aman nol |
| AC-14 | RH 0%, suhu 0°C, arah 0°, serta field kosong diparse sesuai makna; tidak memakai value-or-default |
| AC-15 | Input negatif/tidak finite, component tidak dikenal/duplikat dan T/P/basis tidak sah menghasilkan field diagnosis |
| AC-16 | Buka/migrasi/hapus scenario menghasilkan satu active selection valid dan tidak mengonversi unit dua kali |
| AC-17 | Respons/job untuk selection atau revision lama tidak menimpa panel/current run baru |
| AC-18 | Irregular time integration, event ignition, isolation/blowdown, mass balance dan peak/dose windows diuji independen |
| AC-19 | Konversi 2,5 vol% dengan MW 16,043 pada 25°C/1 atm memberi sekitar 16.403,885 mg/m³; bukan klaim LFL metana |
| AC-20 | Species concentration memakai basis massa/mol yang benar; IDLH tidak diturunkan dari LFL atau dianggap fatality deterministik |
| AC-21 | Dua sound level identik memberi +3,0103 dB; distance/weighting/band sum sesuai basis akustik |
| AC-22 | Benchmark dekat nol/no crossing memakai absolute/status comparison tanpa division by zero |
| AC-23 | Login, CSRF/Origin, session rotation/expiry, password reset/deactivation dan logout diuji; secret tidak bocor di response/log |
| AC-24 | Viewer/outsider tidak dapat menulis/membaca resource terlarang; stale If-Match 409, header hilang 428, last-owner invariant |
| AC-25 | Broker mati setelah DB commit tidak menghilangkan run; outbox/recovery menghasilkan job ketika broker pulih |
| AC-26 | Klik ganda/request serentak/key replay menghasilkan satu run; key berbeda body 409; replay revisi lama setelah proyek berubah tetap menemukan run asli |
| AC-27 | Duplicate delivery dan lease takeover hanya mempublikasikan satu hasil final; worker dengan token lease lama tidak dapat overwrite |
| AC-28 | Worker kill/DB disconnect/restart dapat dipulihkan pada case boundary atau berakhir dengan diagnosis setelah retry limit |
| AC-29 | Cancel-before-start, cancel saat running dan cancel-versus-commit race tidak kehilangan status/artefak atau membatalkan job user lain |
| AC-30 | S3 gagal/partial upload tidak muncul sebagai artefak lengkap; orphan cleanup tidak menghapus object yang sudah direferensikan |
| AC-31 | Browser offline/close/reload/relogin memulihkan runId/status, memakai backoff dan tidak membuat job baru atau menampilkan failure worker palsu |
| AC-32 | API contract major dan engine/model/dataset mismatch terdeteksi; versi salah tidak dipakai diam-diam untuk run lama |
| AC-33 | Restore drill DB/object/image manifest membaca historical artifacts dengan checksum benar dan menjalankan kasus analitik baru |
| AC-34 | Hasil/input/model snapshots immutable; perubahan draft/membership tidak menulis ulang riwayat fisika; semua artifact requests dicek aksesnya |
| AC-35 | PR/phase/mixture/pseudo-component/BIP dan flammability models diuji pada domainnya; missing data atau phase unsupported tidak fallback ideal tanpa deklarasi |
| AC-36 | Critical-flow transition, liquid non-flash/HEM applicability, atmospheric expansion serta inventory mass/energy balance mempunyai acuan independen |
| AC-37 | Pool mass, area/containment, evaporation/burn budget dan early/late ignition mematuhi model/domain; tidak ada pool combustible berarti NA yang sah |
| AC-38 | TNO energy/strength/scaled-curve interpolation, domain boundaries dan overpressure units diuji tanpa mengganti metode dengan TNT equivalent |
| AC-39 | Parts count/rate units, event branch sums dan weather-direction weighting memberi frequency yang diketahui; tidak double count; missing branch menghalangi agregasi final |
| AC-40 | Status process/module/domain/contour/criteria, coverage gaps dan invalid field masks konsisten pada API/UI/export; partial tidak menjadi complete aman |
| AC-41 | Vertical slice nyata dari browser tersimpan melalui DB/outbox/worker sampai chart dan download, memakai fixture analitik dan tanpa kalkulasi browser kedua |
| AC-42 | PDF benar-benar PDF; CSV/JSON unit/koordinat/snapshot sesuai; partial export perlu opsi eksplisit serta label yang jelas |
| AC-43 | Import non-destructive/idempotent mempertahankan original/legacy results dan memblokir Run sampai basis/field wajib yang ambigu diselesaikan |
| AC-44 | Readiness/domain/preflight gate menolak model atau reference yang belum siap; label PHAST/UDM/ISO/API tidak dianggap bukti model telah terimplementasi |

## 3. Tahap rilis dan bukti selesai

| Tahap | Paket utama | Bukti selesai |
| --- | --- | --- |
| R0 — Dokumentasi | WP-00 | Spesifikasi, pengantar dan backlog konsisten; bukti lama/fixture tetap tersedia; implementasi aplikasi masih direncanakan |
| R1 — Fondasi | WP-01,14,15,16 | Akun/project/revisi, preflight/model registry, durable run dan failure tests kontrak tersedia |
| R2 — Vertical slice analitik | WP-03,04 known-tip,05,07,08,17,18,20,21 | UI sampai worker/export bekerja pada model analitik, termasuk reconnect/replay/restore; tidak mengklaim semua model siap |
| R3 — Source dan radiasi prediktif | WP-04 discharge,06,09,10,02 | Domain/korelasi/source/history tervalidasi sesuai kasus yang diklaim; legacy source/hasil lama dipisahkan |
| R4 — TOX/FERA konsekuensi | WP-11,12,19,09 | Setiap modul mempunyai reference manifest, fixtures, diagnostics dan validasi domain sendiri |
| R5 — Impairment | WP-13,09,21 | Event tree/frequency/consequence coverage lengkap dan hit/duration per receptor dapat direproduksi |

Tidak ada checkbox model yang ditandai selesai hanya karena dokumentasinya ada. Dataset TOX/FERA yang konflik tetap berstatus reported_requires_reconciliation sampai basisnya jelas. Backend/library/image versions dikunci dan diuji saat implementasi; rencana ini tidak mengklaim lingkungan runtime tersebut sudah dipasang.

## 4. Checklist fondasi yang dapat langsung dikerjakan nanti

- [ ] Gunakan keputusan Python/backend sebagai authoritative; jangan memelihara dua engine di browser dan server.
- [ ] Bekukan schemaVersion=2, API v1, unit registry, status union dan hash contract.
- [ ] Implementasikan DB revisions, membership/session/CSRF dan immutable snapshots.
- [ ] Implementasikan run+outbox+idempotency dalam satu transaksi sebelum worker penuh.
- [ ] Buat worker baseline analitik dan buktikan lease/cancel/recovery dengan failure injection.
- [ ] Hubungkan autosave/flush/poll/results di frontend dengan OpenAPI client.
- [ ] Buktikan seluruh chart/tabel/export memakai run yang sama.
- [ ] Pertahankan input/file legacy dan tanda stale; hentikan PASS dan nilai nol sebagai pengganti unknown.
- [ ] Tambahkan model fisika berikutnya hanya ketika input/reference/domain/acceptance-nya tersedia.

## 5. Checklist kelengkapan dokumentasi

- [x] Keputusan cakupan, tim internal, akun lokal, Docker/VPS dan tanpa approval ditetapkan.
- [x] Empat belas modul mempunyai delapan butir kontrak perhitungan dalam spesifikasi induk.
- [x] Endpoint, request/response, error, revisi dan idempotensi dirinci.
- [x] Koneksi frontend/backend, queue recovery, storage, auth, migration dan operations dijelaskan.
- [x] Setiap paket mempunyai dependensi, keluaran dan acceptance IDs.
- [x] Referensi TOX/FERA dan fixture analitik tetap ditautkan serta keterbatasannya dinyatakan.
- [ ] Pengadaan/rekonsiliasi referensi primer serta data model yang masih reference_required; ini penghalang aktivasi model, bukan fakta yang telah diselesaikan dokumentasi.

Arsip [backlog awal](./archive/backlog-perbaikan-flare-2026-10-30.md) dan [konsep awal](./archive/konsep-perbaikan-flare-2026-10-30.md) menyimpan konteks sebelum pilihan Python/backend dan perluasan penuh FERA/TOX.
