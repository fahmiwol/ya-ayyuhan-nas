# Riset Mendalam: Aplikasi Quran AI + Framework Penalaran Komputasional dari Quran

*Untuk Fahmi Ghani — disusun per 5 Juli 2026. Semua temuan ditandai [TEKNIS] (rekayasa/actionable) atau [KONSEP] (filosofis/konseptual). Prioritas: open-source, self-hosted, anti vendor lock-in.*

---

## TL;DR
- **Area 1–3 (aplikasi Quran AI) 100% bisa dibangun HARI INI** dengan stack open-source: teks Uthmani terverifikasi dari **Tanzil.net** (CC BY 3.0, *immutable-by-design*) di-cross-check dengan **KFGQPC**, morfologi dari **Quranic Arabic Corpus** (GPL), tafsir dari **spa5k/tafsir_api**, hadith dari **fawazahmed0/hadith-api**, penilaian tajwid via **Whisper fine-tuned Tarteel** + **Montreal Forced Aligner (MIT)**. Immutability dijamin lewat checksum SHA-256 + cross-referencing multi-sumber.
- **Area 4 (Quran → framework penalaran AI) SEBAGIAN NYATA, SEBAGIAN VISIONER**: yang nyata & ada papernya = Quran ontology + GraphRAG (Neo4j), maqasid al-shariah sebagai *objective/evaluation framework*, isnad sebagai model *provenance/data lineage*. Yang spekulatif = "otak AI berbasis Quran" — belum ada, tapi pemetaan konseptual sanad→lineage, hifz→checksum, ijtihad→reasoning loop, qiyas→analogical reasoning bisa jadi cetak biru orisinal.
- **Rekomendasi inti**: PISAHKAN dua proyek (App = produk konkret; Framework = riset). HINDARI klaim "kode 19"/mukjizat numerik (ditolak konsensus akademik). Semua data di-mirror ke storage sendiri, jangan gantung ke CDN publik.

---

## KEY FINDINGS

### AREA 1 — Sumber Teks Quran & Autentisitas

**[TEKNIS] Tabel perbandingan sumber teks:**

| Sumber | Varian teks | Lisensi | Offline? | Format | Catatan |
|---|---|---|---|---|---|
| **Tanzil.net** | Uthmani, Uthmani-minimal, Simple/Imla'i | **CC BY 3.0** — "verbatim copies OK, CHANGING NOT ALLOWED" | Ya | txt/xml/sql/JSON | Standar de-facto, diverifikasi manual vs Mushaf Madinah; v1.1 (Feb 2021); 6236 ayat |
| **KFGQPC (King Fahd)** | Uthmani (Hafs + 8 qiraat: Warsh, Qaloon, Doori, Soosi, Bazzi, Qumbul, Shouba) + font | Teks bebas pakai; **FONT: gratis pakai TAPI tidak boleh dimodifikasi/dijual/reverse-engineer** | Ya | CSV/HTML/JSON/SQL/XLSX/XML | Repo `thetruetruth/quran-data-kfgqpc`, `nuqayah/qpc-fonts`; font QPC v2 = 604 font per-halaman |
| **Quran.com / Quran.Foundation (QUL)** | Uthmani + word-by-word + morfologi + audio timestamp | API pakai **OAuth2 (client_credentials)**; QUL open-source (Ruby on Rails, di GitHub `TarteelAI/quranic-universal-library`) | Ya (QUL download) | JSON/API | `qul.tarteel.ai` = hub terpusat; butuh request access untuk API v4 |
| **AlQuran Cloud** | Uthmani + simple | Gratis, **tanpa API key/registrasi** | Ya (CSV/Excel/MySQL/XML/txt) | REST JSON | 50+ bahasa; base `api.alquran.cloud/v1`; endpoint `/edition/language` untuk hitung persis |
| **Kemenag (LPMQ)** | Mushaf Standar Indonesia (MSI) | **Perlu surat permohonan resmi** ke Kepala LPMQ | Via API resmi | JSON | `quran-api.kemenag.go.id`, >1000 developer terdaftar; sudah ada "Chat Qur'ani" berbasis AI |
| **equran.id** | MSI (scraping Kemenag) | Gratis tanpa registrasi | Via API | JSON | 6 qari, tafsir Kemenag/Quraish Shihab/Jalalain; ada SDK Node.js resmi |
| **Quranic Arabic Corpus** | Morfologi/sintaks/ontologi *word-by-word* | **GPL v3** (copyleft!) | Ya (perlu email) | custom | 77.430 kata, akurasi morfologi ~99%; oleh Kais Dukes (Univ Leeds); 350 konsep + relasi = knowledge graph siap pakai |
| **risan/quran-json** | Uthmani (dari Noble Quran Encyclopedia) + 13 bahasa | **CC-BY-SA 4.0** | Ya (CDN JSON) | JSON | Paling praktis untuk MVP; ada id/en/dll |
| **semarketir/quranjson** | Uthmani + **tajweed JSON** + audio per ayat | Cek repo | Ya | JSON | Punya folder `tajweed/` per surah — berguna untuk highlight tajwid |

**[TEKNIS] Terjemahan multi-bahasa:** **QuranEnc.com** (portal King Fahd Complex) = pilihan terkuat. API REST gratis (`quranenc.com/api/v1/translation/sura/{key}/{sura}` dan `/aya/{key}/{sura}/{aya}`, output JSON dengan field `sura/aya/translation/footnotes`), plus bulk download **XML/CSV/Excel/SQLite/EPUB/PDF**. Homepage menyebut **"+80 Languages"** dengan tiap edisi diberi versi+tanggal (mis. english_rwwad V1.0.19). ⚠️ Reuse diatur oleh "Terms and Policies" (bukan lisensi OSS standar) — baca langsung sebelum komersial. Angka pembanding: Wikipedia menyebut King Fahd Complex telah menerbitkan **55 terjemahan dalam 39 bahasa** (figur berbeda karena beda cakupan). AlQuran Cloud = 50+ bahasa tanpa key (query `/edition/language` untuk angka live persis).

**[KONSEP] + [TEKNIS] Bukti pelestarian teks (dasar untuk "immutable-by-design"):**
- **Rasm Uthmani**: Khalifah Uthman (~650–652 CE) menstandarkan *skeleton konsonan* (rasm), membakar codex varian, distribusi salinan ke pusat-pusat Islam. Mushaf dunia hari ini = riwayat **Hafs 'an 'Asim** (standar edisi Mesir 1924).
- **7 Ahruf vs 10 Qira'at**: 7 ahruf = mode revelasi (hadith Sahih al-Bukhari 2419: "diturunkan atas 7 huruf"). 10 qira'at mutawatir memenuhi **3 syarat Ibn al-Jazari (w. 833 H)**: (1) sesuai kaidah bahasa Arab, (2) sesuai rasm Uthmani, (3) sanad mutawatir. Bacaan yang gagal salah satu syarat = **shadh** (tidak sah untuk shalat). Setiap dari 10 qari punya 2 riwayat mutawatir = 20 transmisi. Pandangan mayoritas (Ibn al-Jazari): rasm mengakomodasi **sebagian** ahruf, bukan semua — beda dgn al-Tabari (hanya 1 harf dipertahankan) & Ibn Hazm (semua 7 dipertahankan). *Ini penting: satu skeleton konsonan, banyak bacaan sah — persis konsep "canonical source + validated variants".*
- **Manuskrip & radiokarbon**: **Birmingham (Mingana 1572a)** di-radiokarbon oleh Oxford Radiocarbon Accelerator Unit (2014): parchment **1465±21 tahun BP, sesuai 95.4% confidence dengan tahun kalender 568–645 CE**; kini dianggap "an early descendant of the Uthmanic codex". Marijn van Putten menunjukkan idiosinkrasi ejaan membuktikan ia turunan tipe-teks Uthmani (bukan pra-Uthmani). **Sana'a palimpsest** (lower text) mungkin lebih tua/pra-Uthmani dengan varian yang tidak cocok codex sahabat manapun (Gabriel Reynolds). **Tübingen** 649–675 CE. ⚠️ Catatan kritis (François Déroche): ada ketidakcocokan tanggal radiokarbon dgn tanggal komposisi yang diketahui pada beberapa Qur'an — **tanggal parchment ≠ tanggal tinta**. Sajikan seimbang.
- **Tawatur & isnad**: transmisi massal (mutawatir) + rantai hafiz = **mekanisme preservasi ganda** (tulisan + lisan). Ini justru argumen kuat untuk desain: teks tervalidasi dari BANYAK sumber independen.
- **[TEKNIS] Verifikasi integritas korpus secara teknis**: (1) SHA-256 checksum per ayat & per file; (2) cross-reference minimal 3 sumber (Tanzil + KFGQPC + QuranEnc) — jika ada 1 karakter beda, tandai konflik; (3) normalisasi Unicode NFC sebelum diff (banyak "typo" digital sebenarnya masalah encoding, seperti diperingatkan Tanzil); (4) simpan **Merkle tree** sehingga perubahan 1 karakter langsung terdeteksi di root hash; (5) jadikan korpus read-only/append-only di database.

### AREA 2 — Asbab al-Nuzul, Hadith, Tafsir, Rijal

**[TEKNIS] Sumber data/API:**
- **Tafsir**: `spa5k/tafsir_api` — **100+ tafsir** multi-bahasa via CDN (jsDelivr/statically/githack), **bisa & sebaiknya self-host** (download folder `data/`, serve sendiri via Nginx/R2/S3). Termasuk Ibn Kathir, al-Tabari, al-Baghawi, al-Saadi, al-Muyassar, al-Qurtubi, Jalalayn. Alternatif: `Quran-Tafseer/tafseer_api`. Indonesia: tafsir Kemenag/Quraish Shihab/Jalalain via equran.id & `renomureza/quran-api-id`.
- **Hadith**: `fawazahmed0/hadith-api` — gratis via CDN, multi-bahasa (ara/eng/ind/urd/dll), **multi-grade (sahih/daif)**, mencakup Kutub al-Sittah + lainnya. ⚠️ Lisensi data **CC BY-NC 4.0** (non-komersial — butuh izin untuk komersial). `gadingnst/hadith-api` (terjemahan Indonesia). `sunnah.com` API (butuh akses). 9 koleksi kanonik: Bukhari, Muslim, Abu Dawud, Tirmidhi, Nasa'i, Ibn Majah (+ Ahmad, Malik, Darimi).
- **Asbab al-Nuzul**: sumber klasik = **al-Wahidi** (*Kitab Asbab al-Nuzul*, ~570 ayat, w. 468 H) & **al-Suyuti** (*Lubab al-Nuqul*). Dataset digital: `tafsircenter/tafsir-mcp` (MCP server) punya **asbab al-nuzul dengan isnad penuh untuk 201 ayat** + 5 tafsir klasik + analisis linguistik word-level (i'rab, sarf, root, rasm), **fully offline** setelah download (~214 MB dari HuggingFace), pakai validasi Pydantic (anti-halusinasi).
- **Rijal/isnad**: dataset **Multi-IsnadSet (MIS)** untuk Sahih Muslim = **2092 narator (node), 77.797 edge**, sudah dimodelkan untuk **Neo4j/Gephi/CytoScape/NetworkX** — siap GNN/social-network-analysis. `muhaddithat/isnad-datasets` (narator perempuan, CSV + Jupyter). Sistem ontologi penilaian isnad (Dalloul & Baraka) mencapai akurasi 81%.

**[KONSEP] Isnad sebagai sistem provenance & verifikasi:** Ilm al-rijal + jarh wa ta'dil = sistem verifikasi provenance yang mengevaluasi (a) kontinuitas rantai, (b) integritas moral narator ('adl), (c) presisi/hafalan (dabt). Ini paralel LANGSUNG dengan **data lineage, trust chains, dan supply-chain provenance** di komputasi modern — sanad pada dasarnya adalah *cryptographically-inspired chain of custody* sebelum ada kriptografi. Catatan penting: AI bisa mempercepat verifikasi isnad (deteksi anomali linguistik) tapi TIDAK bisa menggantikan penilaian 'adl/dabt yang butuh pertimbangan manusia (konsensus riset digital hadith).

### AREA 3 — Tajwid/Qira'at: Speech-to-Text & Deteksi Pelafalan

**[TEKNIS] State of the art (semua terukur):**
- **Model ASR (open, HuggingFace)**: `tarteel-ai/whisper-base-ar-quran` — **WER turun dari 13.38% → 5.75% dalam 5000 step** (fine-tune openai/whisper-base). `tarteel-ai/whisper-tiny-ar-quran`. LoRA: `KheemP/whisper-base-quran-lora` **WER ≈ 5.98% dengan tashkeel** (610-ayah test, 37 qari). Fine-tune Whisper large-v3 / large-v3-turbo juga ada (mis. `IJyad/whisper-large-v3-Tarteel`).
- **Studi banding transformer (arXiv 2606.19747)**: **Wav2Vec2 = WER 0.08** (terbaik), XLS-R = 0.09, mengalahkan baseline Citrinet (0.163) di EveryAyah; training time turun dari 140 → 40 jam.
- **Dataset**: `tarteel-ai/everyayah` — **829 jam training + 103.5 jam validasi**, dari **44 qari profesional laki-laki**, semua 114 surah (via `Salama1429/tarteel-ai-everyayah-Quran`). **Tarteel crowd-sourced dataset**: 25.000 klip = **67.39 jam dari 1200+ individu** selama 6 bulan (CC BY-NC-ND 4.0). **QDAT**: ~1500 suara, 3 aturan tajwid berlabel. Paper 2509.00094: 850+ jam, ~300K utterance, memperkenalkan **Quran Phonetic Script (QPS)** untuk meng-encode aturan tajwid (lebih tepat dari IPA MSA) + algoritma "Tasmeea".
- **Tarteel AI (produk pembanding)**: pakai Whisper fine-tuned + **NVIDIA Riva + NeMo**, real-time <200ms latency, dilatih 75.000+ menit, mencapai **~4% WER** (kisah pelanggan NVIDIA); deteksi mistake word-level + skipped words + tashkeel; 3 tahun R&D. Catatan konteks: dari 1.8 miliar Muslim, hanya ~16% berbahasa Arab.
- **Deteksi mispronunciation (MDD)**: LSTM+MFCC pada QDAT akurasi **95–96%** (3 aturan); pendekatan phoneme-level (DeepSpeech-Quran, transfer + semi-supervised); pipeline segmentasi di waqf (pause) via wav2vec2-BERT (akurasi 99.35%).
- **Forced alignment (mencocokkan audio ke teks kanonik)**: **Montreal Forced Aligner (MFA) — lisensi MIT**, punya model akustik & dictionary Arab, output level kata + fonem (butuh pronunciation dictionary; untuk tajwid perlu adaptasi — ini cost integrasi). Alternatif **CTC forced alignment**: torchaudio (BSD, tapi ⚠️ **deprecated 2.8, dihapus 2.9** — jangan bangun baru di sini) atau `ctc-forced-aligner` (kode BSD, tapi **model default MMS = CC-BY-NC** → ganti ke model Arab seperti `jonatasgrosman/wav2vec2-large-xlsr-53-arabic` untuk komersial).
- **[TEKNIS] Aturan tajwid yang bisa dideteksi akustik**: madd/elongation (fitur durasi), ghunnah (nasalisasi/energi frekuensi rendah), qalqalah (burst energi), idgham/ikhfa/izhar (asimilasi nasal & transisi spektral). Yang lebih sulit: nuansa makharij halus yang butuh telinga terlatih.

**[KONSEP] Talaqqi & AI feedback loop**: Talaqqi (transmisi tatap muka guru→murid, dengan ijazah/sanad) adalah inti pedagogi tajwid dan **tidak tergantikan** — Tarteel sendiri mengakui "bukan pengganti syaikh yang memegang ijazah". AI feedback loop bisa **mengaproksimasi** loop koreksi (deteksi error → highlight → ulangi) untuk latihan mandiri, tapi TIDAK memberi ijazah/sanad. Posisikan sebagai *alat latihan & muraja'ah*, bukan otoritas.

### AREA 4 — Quran → Framework Penalaran Komputasional (proyek baru)

**[KONSEP] Yang NYATA (ada paper/proyek — bisa dipakai):**
- **Quran ontology & knowledge graph**: Quranic Arabic Corpus punya **350 konsep + relasi semantik** = knowledge graph siap pakai. **SemanticTafsir** (RDF knowledge graph Quran+hadith+tafsir+koneksi tematik, query SPARQL, IOS Press Semantic Web Journal). **SemanticHadith** ontology (ACM/Elsevier). **"Trustworthy Islamic Agent"** = Graph-based RAG memakai Quran ontology (285 konsep dari corpus, traversal graph → reasoning) — bukti konsep konkret Area 4 sudah ada.
- **Maqasid al-shariah sebagai objective/evaluation framework**: banyak paper serius (Yaqeen Institute "Toward an Islamic Ethics and Fiqh of AI"; Springer *Philosophy & Technology* 2023 & 2025; Jasser Auda *Maqasid as Philosophy of Islamic Law: A Systems Approach*). 5 nilai (**hifz al-din/nafs/aql/nasl/mal**) berfungsi sebagai *constraint/reward/evaluation layer*. **Usul al-fiqh** (qiyas=analogi, ijma=konsensus, istihsan, maslahah, istishab, sadd al-dhara'i) dipetakan sebagai sistem inferensi formal. Konsensus riset: AI bisa jadi *asisten ijtihad*, tidak bisa gantikan mujtahid (tak paham maqasid & konteks).
- **Numerik "kode 19"**: ⚠️ **DITOLAK konsensus akademik**. Rashad Khalifa (1974) dituduh memanipulasi/memalsukan data (Bilal Philips 1987, Bassam Jarrar 1994): mengandalkan penghitungan basmalah yang inkonsisten, memodifikasi ejaan "Nun" jadi "Nun-Waw-Nun", klaim Ya-Sin gagal (285 vs 281 aktual), dan menghapus 9:128–129 saat tak cocok. **Perlakukan netral & kritis, JANGAN jadikan fitur.**

**[KONSEP]+[TEKNIS] Pemetaan struktur Quran → konsep AI/ML (cetak biru orisinal):**

| Struktur Quran | Konsep AI/ML | Implementasi konkret |
|---|---|---|
| **Sanad/isnad** | Provenance, data lineage | Graph DB (Neo4j), signed transmission chain, setiap output ada "sanad digital" |
| **Hifz** (integritas hafalan) | Data integrity, immutability | SHA-256, Merkle tree, append-only store |
| **Ijtihad** | Reasoning loop, inference under uncertainty | Agentic loop + confidence scoring |
| **Tadabbur** (refleksi) | Chain-of-thought, self-reflection | CoT / Reflexion prompting |
| **Qiyas** (analogi) | Analogical / case-based reasoning | Vector similarity + CBR retrieval |
| **Ijma** (konsensus) | Multi-agent consensus, ensemble | Ensemble voting / multi-agent debate |
| **Lapisan tafsir** | Multi-resolution interpretation | Hierarchical RAG multi-sumber |
| **Muhkam vs mutashabih** (jelas vs samar) | Confidence / ambiguity handling | Uncertainty flag, abstention, "saya tidak yakin" |
| **Cross-referencing tematik** | Knowledge graph, semantic network | Embeddings + graph traversal |

**[TEKNIS] Arsitektur konkret:**
- **Knowledge graph**: Neo4j (node: ayat, surah, konsep, narator, tafsir; edge: relasi tematik, sanad, asbab). Bangun dari Quranic Arabic Corpus + MIS isnad + SemanticTafsir.
- **Semantic search**: model embedding Arab (multilingual-e5, atau Arabic-specific), vector DB **Qdrant/Weaviate** (self-hosted, open-source, hindari Pinecone karena vendor lock).
- **RAG grounded**: **GraphRAG** (gabung vector search + graph traversal) agar tidak halusinasi; grounding ketat ke korpus; setiap klaim di-cite ke sumber (guardrail seperti tafsir-mcp yang pakai validasi Pydantic).
- **Agentic**: LLM sebagai *reasoner*, TAPI semua klaim faktual wajib punya sanad digital (sumber + hash). Maqasid sebagai *evaluation layer* di atas output.

---

## RECOMMENDATIONS (bertahap & konkret)

### Proyek A — Aplikasi Quran AI (produk, bangun sekarang)
**Shortlist data (final):**
1. **Teks**: Tanzil Uthmani (CC BY 3.0) → verifikasi silang dengan KFGQPC & QuranEnc; simpan checksum.
2. **Morfologi/word-by-word**: Quranic Arabic Corpus — ⚠️ GPL copyleft, isolasi di service terpisah (mikroservis) agar tidak "menular" ke seluruh kode.
3. **Terjemahan**: QuranEnc (+80 bahasa) + risan/quran-json (id/en untuk MVP cepat).
4. **Tafsir**: spa5k/tafsir_api (self-host) + Kemenag untuk audiens Indonesia.
5. **Hadith**: fawazahmed0/hadith-api (self-host) — ⚠️ CC BY-NC, hubungi pemilik jika komersial.
6. **Tajwid ASR**: fine-tune Whisper base/large-v3 di `tarteel-ai/everyayah` + MFA (MIT) untuk alignment kata/fonem.
7. **Stack**: Next.js (frontend), Postgres (data terstruktur) + Qdrant (semantic search), semua aset di-mirror ke storage sendiri (Cloudflare R2 / S3 / Nginx). Jangan gantung produksi ke CDN jsDelivr.

**Tahapan:**
- **MVP (bulan 1–2)**: baca Quran + terjemahan id/en + tafsir + audio (risan/quran-json + equran.id). Immutability layer (checksum) dari awal.
- **v2 (bulan 3–5)**: search semantik + word-by-word + hadith + asbab al-nuzul.
- **v3 (bulan 6+)**: fitur tajwid/hifz (ASR + forced alignment). Ini paling berat & probabilistik — rilis terakhir.

### Proyek B — Framework Penalaran (riset, paralel tapi terpisah)
- **Fase 1**: bangun knowledge graph Quran+tafsir+isnad di Neo4j (dari Corpus + MIS + SemanticTafsir).
- **Fase 2**: GraphRAG grounded + embeddings untuk semantic verse search; benchmark anti-halusinasi.
- **Fase 3**: agentic reasoning dengan **maqasid sebagai evaluation layer** + **provenance-by-design** (setiap output punya sanad digital: sumber + hash + rantai transformasi).

### Benchmark/threshold yang mengubah keputusan
- Jika WER ASR pada suara pengguna nyata (bukan qari pro) **>15%** → deteksi tajwid belum layak rilis; tunda fase 3.
- Jika lisensi sumber komersial menghambat → pivot ke Tanzil + KFGQPC + QuranEnc saja (paling aman) dan buat pipeline tafsir/hadith sendiri.
- Jika GraphRAG masih halusinasi >5% klaim tak-tersitasi → jangan rilis fitur "tanya jawab", batasi ke retrieval + tampilkan sumber mentah.

---

## CAVEATS
- **Netralitas teologis**: API hadith di atas Sunni-sentris. **Syiah** memakai koleksi berbeda (al-Kutub al-Arba'a: al-Kafi, Man la yahduruh al-Faqih, Tahdhib, Istibsar) yang TIDAK tercakup — sebutkan eksplisit jika menargetkan audiens lintas mazhab. Perbedaan pandangan ahruf/qira'at (al-Tabari vs Ibn Hazm vs Ibn al-Jazari) juga harus disajikan seimbang.
- **Audit lisensi per-aset WAJIB sebelum komersial**: GPL (Corpus) = copyleft menular; CC-BY-ND (beberapa terjemahan Tanzil) = larang modifikasi; font KFGQPC = tak boleh dimodifikasi/dijual; hadith-api & Tarteel crowd dataset = CC BY-NC (larang komersial); model MMS forced-aligner = CC-BY-NC. Kode boleh MIT, tapi **data/model sering tidak**.
- **Immutability ≠ ASR sempurna**: teks bisa dijamin immutable & terverifikasi, TAPI deteksi tajwid tetap probabilistik. Jangan pernah klaim akurasi 100% atau "pasti benar".
- **Area 4 sebagian visioner**: "otak AI Quran" / "AI yang tahu kebenaran ilahi" BELUM ADA dan berbahaya untuk di-over-claim. Framework yang realistis = **grounding + provenance + evaluation** — yaitu AI yang jujur soal sumber & ketidakpastiannya, BUKAN otoritas ilahi. Talaqqi & ijtihad manusia tetap tak tergantikan.
- **Kode 19 & mukjizat numerik**: kontes, ditolak konsensus akademik (metodologi cacat, data dimanipulasi) — hindari sebagai fitur atau klaim.
- **Radiokarbon manuskrip**: sajikan seimbang — mendukung penanggalan awal, tapi ada perdebatan ilmiah (tanggal parchment vs tinta; hasil lab berbeda-beda). Bukan "bukti mutlak" tapi "konsisten dengan tradisi".