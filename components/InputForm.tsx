import React, { useState } from 'react';
import { FormData, KelasEnum, SemesterEnum } from '../types';

interface InputFormProps {
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<FormData>({
    materi: '',
    kelas: '',
    semester: ''
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!formData.materi.trim()) newErrors.materi = "Materi wajib diisi";
    if (!formData.kelas) newErrors.kelas = "Pilih Kelas";
    if (!formData.semester) newErrors.semester = "Pilih Semester";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-6 md:p-8 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-slate-700 rounded-full opacity-50 pointer-events-none"></div>

      <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
        <span className="bg-edu-900 text-edu-300 border border-edu-700 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
        Detail Pembelajaran
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="materi" className="block text-sm font-medium text-slate-300 mb-2">
            Materi Pembelajaran PJOK
          </label>
          <input
            type="text"
            id="materi"
            name="materi"
            value={formData.materi}
            onChange={handleChange}
            placeholder="Contoh: Permainan Bola Besar, Atletik Lari Jarak Pendek, Senam Lantai"
            className={`w-full px-4 py-3 rounded-lg border bg-slate-900 text-white placeholder-slate-500 ${errors.materi ? 'border-red-500 focus:ring-red-500' : 'border-slate-600 focus:ring-edu-500 focus:border-edu-500'} focus:ring-2 focus:outline-none transition-all duration-200`}
          />
          {errors.materi && <p className="mt-1 text-sm text-red-400">{errors.materi}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="kelas" className="block text-sm font-medium text-slate-300 mb-2">
              Kelas
            </label>
            <select
              id="kelas"
              name="kelas"
              value={formData.kelas}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border bg-slate-900 text-white ${errors.kelas ? 'border-red-500 focus:ring-red-500' : 'border-slate-600 focus:ring-edu-500 focus:border-edu-500'} focus:ring-2 focus:outline-none transition-all duration-200`}
            >
              <option value="">-- Pilih Kelas --</option>
              {Object.values(KelasEnum).map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
            {errors.kelas && <p className="mt-1 text-sm text-red-400">{errors.kelas}</p>}
          </div>

          <div>
            <label htmlFor="semester" className="block text-sm font-medium text-slate-300 mb-2">
              Semester
            </label>
            <select
              id="semester"
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border bg-slate-900 text-white ${errors.semester ? 'border-red-500 focus:ring-red-500' : 'border-slate-600 focus:ring-edu-500 focus:border-edu-500'} focus:ring-2 focus:outline-none transition-all duration-200`}
            >
              <option value="">-- Pilih Semester --</option>
              {Object.values(SemesterEnum).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {errors.semester && <p className="mt-1 text-sm text-red-400">{errors.semester}</p>}
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex items-center justify-center py-4 px-6 border border-transparent rounded-lg text-base font-semibold text-white bg-edu-600 hover:bg-edu-700 focus:outline-none focus:ring-4 focus:ring-edu-900 shadow-md transition-all duration-200 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'transform hover:-translate-y-0.5'}`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sedang Menyusun Kurikulum AI...
              </>
            ) : (
              'Generate CP & Tujuan Pembelajaran'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputForm;