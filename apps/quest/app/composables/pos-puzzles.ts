// Konten soal & clue per pos — DIKLAT 2026 Orientation Quest.
// Sumber: soal.txt dari panitia (13 Nov 2026).
//
// Catatan keamanan: ini KONTEN PUZZLE yang memang harus tampil ke murid, jadi
// boleh ada di bundle frontend. JANGAN taruh code/jawaban verifikasi di sini —
// code satu kali pakai digenerate ketua via /api/admin/pos-codes (lihat server).
export interface PosPuzzle {
  pos: number
  /** Teks soal (slide 1). */
  soalan: string
  /** Clue lokasi pos fisik (slide 2). */
  clueTmpt: string
  /** Petunjuk cara menyelesaikan soal (slide 2, opsional). */
  petunjuk?: string
  /** Ikon material symbols untuk header kartu. */
  icon: string
}

export const POS_PUZZLES: Record<number, PosPuzzle> = {
  1: {
    pos: 1,
    soalan:
      'Aku merupakan perangkat lunak yang bertugas mengatur seluruh aktivitas komputer. Aku memiliki beberapa jenis, seperti Windows, Linux, dan macOS. Dalam dunia pemrograman, aku menjadi lingkungan tempat programmer menjalankan kode, menggunakan aplikasi coding, serta mengelola file program. Siapakah aku?',
    clueTmpt:
      'Sebuah tempat untuk menitipkan sebuah transportasi yang dapat diawasi oleh penjaga sekolah.',
    icon: 'terminal',
  },
  2: {
    pos: 2,
    soalan:
      'Aku berkaitan dengan pembuatan aplikasi Android maupun desktop. Aku memiliki bagian yang berinteraksi langsung dengan pengguna dan bagian yang bekerja di balik layar. Dalam pembuatanku, tampilan dan pengalaman pengguna harus diperhatikan, serta terdapat konsep pemrograman berorientasi objek yang menjadi salah satu dasar pengembangannya. Siapakah aku?',
    clueTmpt:
      'Sebuah tempat transaksi logistik antar agen dengan individu yang beroperasi atas 2 agen yang berbeda.',
    icon: 'android',
  },
  3: {
    pos: 3,
    soalan:
      'Aku merupakan langkah-langkah logis yang disusun secara berurutan untuk menyelesaikan suatu masalah. Aku membantu programmer menentukan apa yang harus dilakukan komputer mulai dari awal hingga mendapatkan hasil yang diinginkan. Aku juga dapat digambarkan menggunakan simbol-simbol tertentu agar lebih mudah dipahami. Siapakah aku?',
    clueTmpt:
      'Sebuah jalan yang memiliki kemiringan 30°-35° dengan tujuan untuk menuju sebuah jurusan yang tujuan dari jurusan tersebut ialah mempelajari cara memasang, menyambung (splicing), dan merawat kabel fiber optik yang menjadi tulang punggung internet cepat saat ini.',
    icon: 'data_object',
  },
  4: {
    pos: 4,
    soalan:
      'Aku menggunakan berbagai simbol dengan bentuk yang berbeda untuk menggambarkan alur langkah-langkah suatu proses secara berurutan. Salah satu simbolku berbentuk ketupat yang digunakan ketika program harus menentukan pilihan berdasarkan suatu kondisi. Siapakah aku?',
    clueTmpt:
      'Sebuah tempat duduk dimana kita menunggu untuk membayar urusan keuangan sekolah atau mengambil sebuah kartu ujian.',
    icon: 'account_tree',
  },
  5: {
    pos: 5,
    soalan:
      'Aku merupakan struktur dalam pemrograman yang memungkinkan program mengambil keputusan berdasarkan suatu kondisi. Jika kondisi bernilai benar, program menjalankan perintah tertentu, sedangkan jika salah, program akan menjalankan perintah yang berbeda. Apakah aku?',
    clueTmpt:
      'Sebuah lorong mencekam dimana terdapat sebuah penyaring udara/kipas kuno yang berdebu.',
    icon: 'hub',
  },
}

export function getPosPuzzle(pos: number): PosPuzzle | null {
  return POS_PUZZLES[pos] ?? null
}
