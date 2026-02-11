import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Folder,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ArrowRight,
  Loader2,
  Search,
  Filter,
  Activity,
} from "lucide-react";
import api from "../libs/axios.js";

const DashboardPage = () => {
  const [measures, setMeasures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const departments = [
    "Bilgi Güvenliği",
    "Bilişim Altyapı",
    "Elektronik",
    "Koruma Güvenlik",
    "Sunucu",
    "Teknik",
    "Yazılım",
  ];

  const urgentStatuses = [
    "Uygulanmadı",
    "Kısmen Uygulandı",
    "Çoğunlukla Uygulandı",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/measures");

        setMeasures(res.data);
      } catch (error) {
        console.error("Veri çekilemedi", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const total = measures.length;
  const completed = measures.filter((m) => m.status2026 === "Uygulandı").length;
  const notApplicable = measures.filter(
    (m) => m.status2026 === "Uygulanabilir Değil",
  ).length;

  const urgentMeasures = measures.filter(
    (m) =>
      m.status2026 !== "Uygulandı" && m.status2026 !== "Uygulanabilir Değil",
  );

  const filteredUrgentMeasures = urgentMeasures.filter((m) => {
    const matchesSearch =
      m.measureNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment =
      filterDepartment === "" || m.department === filterDepartment;

    const matchesStatus = filterStatus === "" || m.status2026 === filterStatus;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const complianceRate =
    total > 0 ? Math.round((completed / (total - notApplicable)) * 100) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Genel Bakış</h1>

        <p className="text-gray-500 text-sm mt-1">
          Sistemin 2026 uyumluluk durumu ve aksiyon planları.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-3 rounded-lg bg-indigo-100 text-indigo-600">
            <Folder size={24} />
          </div>

          <div>
            <p className="text-xs text-gray-500 uppercase font-bold">
              Toplam Tedbir
            </p>

            <h3 className="text-2xl font-bold text-gray-900">{total}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-3 rounded-lg bg-green-100 text-green-600">
            <CheckCircle size={24} />
          </div>

          <div>
            <p className="text-xs text-gray-500 uppercase font-bold">
              Uygulanan (2026)
            </p>

            <h3 className="text-2xl font-bold text-gray-900">{completed}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-3 rounded-lg bg-red-100 text-red-600">
            <AlertTriangle size={24} />
          </div>

          <div>
            <p className="text-xs text-gray-500 uppercase font-bold">
              Acil Aksiyon
            </p>

            <h3 className="text-2xl font-bold text-gray-900">
              {urgentMeasures.length}
            </h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
            <span className="text-xl font-bold">%</span>
          </div>

          <div>
            <p className="text-xs text-gray-500 uppercase font-bold">
              Uyumluluk Oranı
            </p>

            <h3 className="text-2xl font-bold text-gray-900">
              %{isNaN(complianceRate) ? 0 : complianceRate}
            </h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <XCircle className="text-red-500" size={20} />
              Acil Müdahale Gerektirenler
            </h3>

            <span className="text-xs font-medium bg-red-100 text-red-700 px-2 py-1 rounded-full">
              {filteredUrgentMeasures.length} / {urgentMeasures.length}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={16}
              />

              <input
                type="text"
                placeholder="Tedbir No Ara..."
                className="w-full sm:w-40 pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-100 bg-gray-50 focus:bg-white transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="relative flex-1 sm:flex-none">
              <Filter
                className="absolute left-3 top-2.5 text-gray-400"
                size={16}
              />

              <select
                className="w-full sm:w-40 pl-9 pr-8 py-2 text-sm rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-100 bg-gray-50 focus:bg-white transition-all appearance-none cursor-pointer"
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

            <div className="relative flex-1 sm:flex-none">
              <Activity
                className="absolute left-3 top-2.5 text-gray-400"
                size={16}
              />

              <select
                className="w-full sm:w-40 pl-9 pr-8 py-2 text-sm rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-100 bg-gray-50 focus:bg-white transition-all appearance-none cursor-pointer"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">Tüm Acil Durumlar</option>
                {urgentStatuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="p-4 font-semibold text-gray-700">Tedbir No</th>
                <th className="p-4 font-semibold text-gray-700">Birim</th>
                <th className="p-4 font-semibold text-gray-700">
                  Mevcut Durum
                </th>
                <th className="p-4 text-right font-semibold text-gray-700">
                  Aksiyon
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredUrgentMeasures.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-500">
                    {urgentMeasures.length > 0
                      ? "Seçilen filtrelere uygun acil tedbir yok."
                      : "Harika! Acil müdahale gerektiren bir durum kalmadı."}
                  </td>
                </tr>
              ) : (
                filteredUrgentMeasures.map((m) => (
                  <tr
                    key={m._id}
                    className="hover:bg-red-50 transition-colors group"
                  >
                    <td className="p-4 font-semibold text-gray-900">
                      {m.measureNumber}
                    </td>

                    <td className="p-4">{m.department}</td>

                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded text-xs font-bold bg-white border border-red-200 text-red-700 shadow-sm">
                        {m.status2026}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <Link
                        to={`/dashboard/measures/edit/${m._id}`}
                        className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium text-xs bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Düzenle <ArrowRight size={14} />
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

export default DashboardPage;
