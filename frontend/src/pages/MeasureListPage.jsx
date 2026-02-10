import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, FileText } from "lucide-react";
import api from "../libs/axios.js";

const MeasureListPage = () => {
  const [measures, setMeasures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");

  const departments = [
    "Bilgi Güvenliği",
    "Bilişim Altyapı",
    "Elektronik",
    "Koruma Güvenlik",
    "Sunucu",
    "Teknik",
    "Yazılım",
  ];

  useEffect(() => {
    fetchMeasures();
  }, []);

  const fetchMeasures = async () => {
    try {
      const res = await api.get("/measures");

      setMeasures(res.data);
    } catch (error) {
      console.error("Veri hatası", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      Uygulandı: "bg-green-100 text-green-700",
      "Çoğunlukla Uygulandı": "bg-blue-100 text-blue-700",
      "Kısmen Uygulandı": "bg-yellow-100 text-yellow-700",
      Uygulanmadı: "bg-red-100 text-red-700",
      "Uygulanabilir Değil": "bg-gray-100 text-gray-600",
    };

    return (
      <span
        className={`px-2 py-1 rounded text-xs font-semibold ${styles[status] || "bg-gray-50"}`}
      >
        {status}
      </span>
    );
  };

  const filteredMeasures = measures.filter((m) => {
    const matchesSearch =
      m.measureNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment =
      filterDepartment === "" || m.department === filterDepartment;

    return matchesSearch && matchesDepartment;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">
          Tedbir Takip Listesi
        </h1>

        <Link
          to="/dashboard/add-measure"
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow"
        >
          <Plus size={18} /> Yeni Tedbir Ekle
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />

          <input
            type="text"
            placeholder="Tedbir No ara..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-100"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="p-2.5 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-100 bg-white min-w-[200px]"
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
        >
          <option value="">Tüm Birimler</option>
          {departments.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-900 font-semibold border-b border-gray-200">
              <tr>
                <th className="p-4">Tedbir No</th>
                <th className="p-4">Birim</th>
                <th className="p-4">2025 Durum</th>
                <th className="p-4">2026 Durum</th>
                <th className="p-4">Detay</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-6 text-center">
                    Yükleniyor...
                  </td>
                </tr>
              ) : filteredMeasures.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-gray-400">
                    Kayıt bulunamadı.
                  </td>
                </tr>
              ) : (
                filteredMeasures.map((measure) => (
                  <tr key={measure._id} className="hover:bg-gray-50 transition">
                    <td className="p-4 font-medium text-gray-900">
                      {measure.measureNumber}
                    </td>
                    <td className="p-4">{measure.department}</td>

                    <td className="p-4">
                      {getStatusBadge(measure.status2025)}
                    </td>

                    <td className="p-4">
                      {getStatusBadge(measure.status2026)}
                    </td>

                    <td className="p-4">
                      <Link
                        to={`/dashboard/measures/edit/${measure._id}`}
                        className="text-indigo-600 hover:text-indigo-800 p-2 rounded hover:bg-indigo-50 inline-block"
                      >
                        <FileText size={18} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MeasureListPage;
