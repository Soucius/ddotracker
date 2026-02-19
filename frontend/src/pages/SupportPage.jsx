import { useState, useEffect } from "react";
import { Send, AlertCircle, Loader2, HelpCircle } from "lucide-react";
import toast from "react-hot-toast";
import api from "../libs/axios.js";

const SupportPage = () => {
  const [loading, setLoading] = useState(false);
  const [measures, setMeasures] = useState([]);
  const [formData, setFormData] = useState({
    department: "",
    measureNumber: "",
    description: "",
  });

  const departments = [
    "Bilgi Güvenliği",
    "Bilişim Altyapı",
    "Elektronik",
    "İnsan Kaynakları",
    "Koruma Güvenlik",
    "Sunucu",
    "Teknik",
    "Yazılım",
  ];

  useEffect(() => {
    const fetchMeasures = async () => {
      try {
        const res = await api.get("/measures");

        setMeasures(res.data);
      } catch (error) {
        console.error("Tedbirler yüklenemedi", error);
      }
    };
    fetchMeasures();
  }, []);

  const filteredMeasures = measures.filter(
    (m) => m.department === formData.department,
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "department") {
      setFormData({ ...formData, department: value, measureNumber: "" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.department ||
      !formData.measureNumber ||
      !formData.description
    ) {
      return toast.error("Lütfen tüm alanları doldurun.");
    }

    setLoading(true);
    try {
      await api.post("/support", formData);

      toast.success("Destek talebiniz başarıyla yöneticiye iletildi!");

      setFormData({ department: "", measureNumber: "", description: "" });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Gönderim sırasında bir hata oluştu.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <HelpCircle className="text-indigo-600" size={28} />
          Destek ve Hata Bildirimi
        </h1>

        <p className="text-gray-500 text-sm mt-1">
          Sistemde veya rehberde karşılaştığınız uyumsuzlukları, eksikleri veya
          hataları bu form aracılığıyla bildirebilirsiniz. Talebiniz doğrudan
          yöneticiye iletilecektir.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 text-blue-800 text-sm">
        <AlertCircle className="shrink-0 text-blue-600" size={20} />

        <p>
          Lütfen hatayı olabildiğince detaylı açıklayın. Hangi sayfada
          olduğunuzu veya rehberin hangi kısmında çelişki olduğunu belirtmeniz
          çözüm sürecini hızlandıracaktır.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hatanın İlgili Olduğu Birim
            </label>

            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-100 bg-gray-50 focus:bg-white transition"
            >
              <option value="">Birim Seçiniz...</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              İlgili Tedbir Numarası
            </label>

            <select
              name="measureNumber"
              value={formData.measureNumber}
              onChange={handleChange}
              disabled={!formData.department} // Birim seçilmeden aktif olmaz
              className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-100 bg-gray-50 focus:bg-white transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">
                {!formData.department
                  ? "Önce birim seçiniz"
                  : "Tedbir Seçiniz..."}
              </option>

              {filteredMeasures
                .sort((a, b) =>
                  a.measureNumber.localeCompare(b.measureNumber, undefined, {
                    numeric: true,
                  }),
                )
                .map((m) => (
                  <option key={m._id} value={m.measureNumber}>
                    {m.measureNumber}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hata Açıklaması / Detaylar
          </label>

          <textarea
            name="description"
            rows="5"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-100 transition resize-y"
            placeholder="Karşılaştığınız sorunu veya eksikliği detaylı bir şekilde açıklayınız..."
          ></textarea>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg transition shadow-lg shadow-indigo-100 font-medium active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed w-full sm:w-auto"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Send size={20} />
            )}
            Bildirimi Gönder
          </button>
        </div>
      </form>
    </div>
  );
};

export default SupportPage;
