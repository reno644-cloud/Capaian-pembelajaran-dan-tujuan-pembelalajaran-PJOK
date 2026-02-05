export enum KelasEnum {
  KELAS_1 = "Kelas 1",
  KELAS_2 = "Kelas 2",
  KELAS_3 = "Kelas 3",
  KELAS_4 = "Kelas 4",
  KELAS_5 = "Kelas 5",
  KELAS_6 = "Kelas 6"
}

export enum SemesterEnum {
  GANJIL = "Ganjil",
  GENAP = "Genap"
}

export interface FormData {
  materi: string;
  kelas: string;
  semester: string;
}

export interface GeneratedContent {
  htmlContent: string;
  rawText: string;
}