import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  FileText,
  Filter,
  Activity,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import api from "../libs/axios.js";

const MeasureListPage = () => {
  const [measures, setMeasures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const departments = [
    "Bilgi Güvenliği",
    "Bilişim Altyapı",
    "Elektronik",
    "Koruma Güvenlik",
    "İnsan Kaynakları",
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

  useEffect(() => {
    fetchMeasures();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterDepartment, filterStatus, itemsPerPage]);

  const fetchMeasures = async () => {
    try {
      const res = await api.get("/measures");

      const sortedData = res.data.sort((a, b) => {
        return b.measureNumber.localeCompare(a.measureNumber, undefined, {
          numeric: true,
          sensitivity: "base",
        });
      });

      setMeasures(sortedData);
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
    const matchesStatus = filterStatus === "" || m.status2026 === filterStatus;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMeasures.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredMeasures.length / itemsPerPage);

  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);

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

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />

          <input
            type="text"
            placeholder="Tedbir No veya Birim ara..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-100 transition"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="relative min-w-[200px]">
          <Filter className="absolute left-3 top-3 text-gray-400" size={18} />

          <select
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-100 bg-white cursor-pointer appearance-none"
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

        <div className="relative min-w-[200px]">
          <Activity className="absolute left-3 top-3 text-gray-400" size={18} />

          <select
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-100 bg-white cursor-pointer appearance-none"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">Tüm Durumlar</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-900 font-semibold border-b border-gray-200">
              <tr>
                <th className="p-4 w-32">Tedbir No</th>
                <th className="p-4 w-40">Birim</th>
                <th className="p-4">2025 Durum</th>
                <th className="p-4">2026 Durum</th>
                <th className="p-4 w-20 text-center">İşlem</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-6 text-center">
                    Yükleniyor...
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-gray-400">
                    Kayıt bulunamadı.
                  </td>
                </tr>
              ) : (
                currentItems.map((measure) => (
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

                    <td className="p-4 text-center">
                      <Link
                        to={`/dashboard/measures/edit/${measure._id}`}
                        className="text-indigo-600 hover:text-indigo-800 p-2 rounded hover:bg-indigo-50 inline-block transition"
                        title="Düzenle"
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

        {!loading && filteredMeasures.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-gray-200 bg-gray-50 gap-4">
            <div className="text-sm text-gray-600">
              Toplam{" "}
              <span className="font-semibold">{filteredMeasures.length}</span>{" "}
              kayıttan{" "}
              <span className="font-semibold">{indexOfFirstItem + 1}</span> -{" "}
              <span className="font-semibold">
                {Math.min(indexOfLastItem, filteredMeasures.length)}
              </span>{" "}
              arası gösteriliyor.
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Satır:</span>

                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="border border-gray-300 rounded-md text-sm p-1 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white cursor-pointer"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={goToFirstPage}
                  disabled={currentPage === 1}
                  className="p-1 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600"
                  title="İlk Sayfa"
                >
                  <ChevronsLeft size={20} />
                </button>

                <button
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                  className="p-1 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600"
                  title="Önceki Sayfa"
                >
                  <ChevronLeft size={20} />
                </button>

                <span className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700">
                  {currentPage} / {totalPages}
                </span>

                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="p-1 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600"
                  title="Sonraki Sayfa"
                >
                  <ChevronRight size={20} />
                </button>

                <button
                  onClick={goToLastPage}
                  disabled={currentPage === totalPages}
                  className="p-1 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600"
                  title="Son Sayfa"
                >
                  <ChevronsRight size={20} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MeasureListPage;
