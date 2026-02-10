import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Folder,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ArrowRight,
  Loader2,
} from "lucide-react";
import api from "../libs/axios.js";

const DashboardPage = () => {
  const [measures, setMeasures] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const complianceRate =
    total > 0 ? Math.round((completed / (total - notApplicable)) * 100) : 0;

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
      </div>
    );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Genel Bakış</h1>

        <p className="text-gray-500 text-sm mt-1">
          Sistemin 2026 uyumluluk durumu ve aksiyon planları.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-lg bg-indigo-100 text-indigo-600">
            <Folder />
          </div>

          <div>
            <p className="text-xs text-gray-500 uppercase font-bold">
              Toplam Tedbir
            </p>

            <h3 className="text-2xl font-bold">{total}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-lg bg-green-100 text-green-600">
            <CheckCircle />
          </div>

          <div>
            <p className="text-xs text-gray-500 uppercase font-bold">
              Uygulanan (2026)
            </p>

            <h3 className="text-2xl font-bold">{completed}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-lg bg-red-100 text-red-600">
            <AlertTriangle />
          </div>

          <div>
            <p className="text-xs text-gray-500 uppercase font-bold">
              Acil Aksiyon
            </p>

            <h3 className="text-2xl font-bold">{urgentMeasures.length}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-lg bg-blue-100 text-blue-600">%</div>

          <div>
            <p className="text-xs text-gray-500 uppercase font-bold">
              Uyumluluk Oranı
            </p>

            <h3 className="text-2xl font-bold">
              %{isNaN(complianceRate) ? 0 : complianceRate}
            </h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <XCircle className="text-red-500" size={20} />
            Acil Müdahale Gerektirenler
          </h3>

          <span className="text-xs font-medium bg-red-100 text-red-700 px-2 py-1 rounded-full">
            {urgentMeasures.length} Kayıt
          </span>
        </div>

        <div className="overflow-x-auto max-h-96 overflow-y-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="p-4">Tedbir No</th>
                <th className="p-4">Birim</th>
                <th className="p-4">Mevcut Durum</th>
                <th className="p-4 text-right">Aksiyon</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {urgentMeasures.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="p-6 text-center text-green-600 font-medium"
                  >
                    Harika! Tüm tedbirler uygulanmış durumda.
                  </td>
                </tr>
              ) : (
                urgentMeasures.map((m) => (
                  <tr key={m._id} className="hover:bg-red-50 transition-colors">
                    <td className="p-4 font-semibold text-gray-900">
                      {m.measureNumber}
                    </td>

                    <td className="p-4">{m.department}</td>

                    <td className="p-4">
                      <span className="px-2 py-1 rounded text-xs font-bold bg-red-100 text-red-700">
                        {m.status2026}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <Link
                        to={`/dashboard/measures/edit/${m._id}`}
                        className="text-indigo-600 hover:text-indigo-800 font-medium text-xs flex items-center justify-end gap-1"
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
