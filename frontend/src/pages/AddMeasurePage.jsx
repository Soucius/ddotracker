import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, ArrowLeft, Loader2 } from "lucide-react";
import api from "../libs/axios.js";
import toast from "react-hot-toast";

const AddMeasurePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const departments = [
    "Bilgi Güvenliği",
    "Bilişim Altyapı",
    "Elektronik",
    "Koruma Güvenlik",
    "Sunucu",
    "Teknik",
    "Yazılım",
  ];
  const statuses = [
    "Uygulanabilir Değil",
    "Uygulanmadı",
    "Kısmen Uygulandı",
    "Çoğunlukla Uygulandı",
    "Uygulandı",
  ];

  const [formData, setFormData] = useState({
    department: "",
    measureNumber: "",
    status2025: "",
    status2026: "",
    changes: "",
    deficiencies: "",
    todo: "",
    policy: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.department || !formData.status2025 || !formData.status2026) {
      toast.error("Lütfen birim ve durum alanlarını seçiniz.");

      return;
    }

    setLoading(true);

    try {
      await api.post("/measures", formData);

      toast.success("Tedbir başarıyla kaydedildi!");

      navigate("/dashboard/measures");
    } catch (error) {
      console.error(error);

      toast.error("Kaydedilirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition"
        >
          <ArrowLeft size={20} />
        </button>

        <h1 className="text-2xl font-bold text-gray-800">Yeni Tedbir Ekle</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Birim Seçin
            </label>

            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-200 outline-none"
            >
              <option value="">Seçiniz...</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tedbir Numarası
            </label>

            <input
              type="text"
              name="measureNumber"
              value={formData.measureNumber}
              onChange={handleChange}
              placeholder="Örn: 3.1.1.1"
              className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-200 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
          <div>
            <label className="block text-sm font-semibold text-indigo-900 mb-1">
              2025 Durumu
            </label>

            <select
              name="status2025"
              value={formData.status2025}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-indigo-200 focus:ring-2 focus:ring-indigo-300 outline-none"
            >
              <option value="">Seçiniz...</option>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-purple-900 mb-1">
              2026 Durumu
            </label>

            <select
              name="status2026"
              value={formData.status2026}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-300 outline-none"
            >
              <option value="">Seçiniz...</option>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Yapılan Değişiklikler
            </label>

            <textarea
              name="changes"
              rows="3"
              value={formData.changes}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-200 outline-none"
              placeholder="Bu tedbirle ilgili yapılan son değişiklikleri buraya giriniz..."
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Eksiklikler
            </label>

            <textarea
              name="deficiencies"
              rows="3"
              value={formData.deficiencies}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-200 outline-none"
              placeholder="Mevcut eksiklikleri belirtiniz..."
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Yapılması Gerekenler
            </label>

            <textarea
              name="todo"
              rows="3"
              value={formData.todo}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-yellow-200 outline-none"
              placeholder="Gelecek aksiyon planları..."
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tedbir Politikası
            </label>

            <textarea
              name="policy"
              rows="3"
              value={formData.policy}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-200 outline-none"
              placeholder="İlgili politika metni..."
            ></textarea>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 font-medium"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Save size={20} />
            )}
            Tedbiri Kaydet
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMeasurePage;
