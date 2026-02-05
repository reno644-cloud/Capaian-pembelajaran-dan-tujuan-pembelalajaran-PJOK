import { GoogleGenAI } from "@google/genai";
import { FormData } from "../types";

const apiKey = process.env.API_KEY;

// Initialize GoogleGenAI
const ai = new GoogleGenAI({ apiKey: apiKey });

export const generateCPTP = async (formData: FormData): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key tidak ditemukan.");
  }

  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Bertindaklah sebagai Ahli Kurikulum Merdeka mata pelajaran PJOK (Pendidikan Jasmani, Olahraga, dan Kesehatan) Sekolah Dasar.
    
    Tugas Anda adalah membuat dokumen "CAPAIAN PEMBELAJARAN DAN TUJUAN PEMBELAJARAN PJOK" yang terstruktur rapi.
    
    Informasi Input:
    - Materi Pembelajaran: ${formData.materi}
    - Kelas Fokus: ${formData.kelas}
    - Semester: ${formData.semester}

    Instruksi Output:
    1. Output HARUS berupa format HTML TABLE yang valid dan siap di-copy ke Microsoft Word/Google Docs. 
    2. Gunakan inline CSS untuk border tabel agar saat di-copy border tetap terlihat (style="border: 1px solid black; border-collapse: collapse; padding: 8px;").
    3. Struktur konten harus mencakup 3 FASE (A, B, C) untuk menunjukkan alur pembelajaran materi tersebut (Deep Learning trajectory), namun berikan highlight/penekanan pada Fase yang sesuai dengan Kelas input (${formData.kelas}).
    
    Struktur Tabel yang diminta:
    - Judul Besar: CAPAIAN PEMBELAJARAN DAN TUJUAN PJOK - [MATERI]
    - Sub-judul: Kelas: ${formData.kelas}, Semester: ${formData.semester}
    
    Tabel Utama dengan kolom: 
    - FASE (A/B/C) & KELAS
    - ELEMEN CP (Misal: Terampil Bergerak, Belajar Melalui Gerak, dll)
    - CAPAIAN PEMBELAJARAN (CP)
    - TUJUAN PEMBELAJARAN (TP) - Buat poin-poin yang spesifik dan terukur.
    - INDIKATOR KETERCAPAIAN

    Isi konten dengan bahasa pendidikan yang formal, pedagogis, dan sesuai dengan standar Kurikulum Merdeka terbaru.
    Pastikan FASE A (Kelas 1-2), FASE B (Kelas 3-4), dan FASE C (Kelas 5-6) semuanya ada dalam tabel untuk melihat kesinambungan materi "${formData.materi}".

    Jangan gunakan Markdown code block (\`\`\`), langsung berikan HTML table nya saja.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    const text = response.text;
    if (!text) {
      throw new Error("Gagal menghasilkan konten. Silakan coba lagi.");
    }

    // Clean up if the model accidentally adds markdown ticks
    return text.replace(/```html/g, '').replace(/```/g, '');
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Terjadi kesalahan saat menghubungi AI. Periksa koneksi atau API Key Anda.");
  }
};