import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save, ArrowLeft, Loader2, Trash2 } from "lucide-react";
import api from "../libs/axios.js";
import toast from "react-hot-toast";

const EditMeasurePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

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

  useEffect(() => {
    const fetchMeasure = async () => {
      try {
        const res = await api.get(`/measures/${id}`);

        setFormData(res.data);
      } catch (error) {
        toast.error("Tedbir bilgileri yüklenemedi.", error);

        navigate("/dashboard/measures");
      } finally {
        setFetching(false);
      }
    };
    fetchMeasure();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      await api.put(`/measures/${id}`, formData);

      toast.success("Tedbir güncellendi!");

      navigate("/dashboard/measures");
    } catch (error) {
      toast.error("Güncelleme hatası.", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Bu tedbiri silmek istediğinize emin misiniz?")) return;

    try {
      await api.delete(`/measures/${id}`);

      toast.success("Tedbir silindi.");

      navigate("/dashboard/measures");
    } catch (error) {
      toast.error("Silme işlemi başarısız.", error);
    }
  };

  if (fetching) return <div className="p-10 text-center">Yükleniyor...</div>;

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition"
          >
            <ArrowLeft size={20} />
          </button>

          <h1 className="text-2xl font-bold text-gray-800">Tedbiri Düzenle</h1>
        </div>

        <button
          onClick={handleDelete}
          className="text-red-500 hover:bg-red-50 p-2 rounded-lg flex items-center gap-2 text-sm font-medium"
        >
          <Trash2 size={18} /> Sil
        </button>
      </div>

      <form
        onSubmit={handleUpdate}
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
              className="w-full p-3 rounded-lg border border-gray-200 outline-none"
            >
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
              className="w-full p-3 rounded-lg border border-gray-200 outline-none"
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
              className="w-full p-3 rounded-lg border border-indigo-200 outline-none"
            >
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
              className="w-full p-3 rounded-lg border border-purple-200 outline-none"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {["changes", "deficiencies", "todo", "policy"].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                {field === "changes"
                  ? "Yapılan Değişiklikler"
                  : field === "deficiencies"
                    ? "Eksiklikler"
                    : field === "todo"
                      ? "Yapılması Gerekenler"
                      : "Politika"}
              </label>

              <textarea
                name={field}
                rows="3"
                value={formData[field]}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-gray-200 outline-none"
              ></textarea>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition shadow-lg font-medium"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Save size={20} />
            )}{" "}
            Güncelle
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditMeasurePage;
