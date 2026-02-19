import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Save,
  ArrowLeft,
  Loader2,
  Trash2,
  FileText,
  BookOpen,
} from "lucide-react";
import api from "../libs/axios.js";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import { fontBase64 } from "../fonts/TrFont.js";

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
        toast.error("Tedbir verisi yüklenemedi.", error);

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

      toast.success("Tedbir başarıyla güncellendi!");

      navigate("/dashboard/measures");
    } catch (error) {
      console.error(error);

      toast.error("Güncelleme sırasında hata oluştu.");
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
    } catch (e) {
      toast.error("Silme işlemi başarısız.", e);
    }
  };

  const handleCreatePDF = () => {
    const doc = new jsPDF();
    const myFontName = "TrFont";

    if (fontBase64) {
      doc.addFileToVFS("TrFont.ttf", fontBase64);
      doc.addFont("TrFont.ttf", myFontName, "normal");
      doc.setFont(myFontName);
    } else {
      toast.error("Türkçe font dosyası bulunamadı!");
    }

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const maxLineWidth = pageWidth - margin * 2;
    let yPos = 20;

    doc.setFontSize(16);
    doc.text("İSKİ GENEL MÜDÜRLÜĞÜ", pageWidth / 2, yPos, { align: "center" });

    yPos += 10;
    doc.setFontSize(10);
    const dateStr = new Date().toLocaleDateString("tr-TR");
    doc.text(`Tarih: ${dateStr}`, pageWidth - margin, yPos, { align: "right" });

    yPos += 15;

    doc.setFontSize(11);
    doc.text(`İLGİLİ BİRİM: ${formData.department}`, margin, yPos);
    yPos += 7;
    doc.text(`TEDBİR NUMARASI: ${formData.measureNumber}`, margin, yPos);
    yPos += 15;
    doc.text(`2025 DURUMU: ${formData.status2025}`, margin, yPos);
    yPos += 7;
    doc.text(`2026 DURUMU: ${formData.status2026}`, margin, yPos);
    yPos += 15;

    const addSection = (title, content) => {
      if (yPos > pageHeight - 20) {
        doc.addPage();
        yPos = 20;
        doc.setFont(myFontName);
      }

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);
      doc.text(title, margin, yPos);
      yPos += 7;

      doc.setTextColor(50, 50, 50);
      doc.setFontSize(10);

      const contentText = content || "-";
      const splitText = doc.splitTextToSize(contentText, maxLineWidth);

      splitText.forEach((line) => {
        if (yPos > pageHeight - 15) {
          doc.addPage();
          yPos = 20;

          doc.setFont(myFontName);
          doc.setFontSize(10);
          doc.setTextColor(50, 50, 50);
        }

        doc.text(line, margin, yPos);
        yPos += 5;
      });

      yPos += 5;
    };

    addSection("YAPILAN DEĞİŞİKLİKLER:", formData.changes);
    addSection("EKSİKLİKLER:", formData.deficiencies);
    addSection("YAPILMASI GEREKENLER:", formData.todo);
    addSection("POLİTİKA:", formData.policy);

    if (yPos > pageHeight - 40) {
      doc.addPage();
      yPos = 20;
      doc.setFont(myFontName);
    } else {
      yPos += 5;
    }

    doc.setDrawColor(150, 150, 150);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 10;

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);

    const footerText = `Biriminizce, yukarıda belirtilen "${formData.measureNumber}" numaralı tedbir ile ilgili tespit edilen eksikliklerin giderilmesi, yapılan değişikliklerin sisteme işlenmesi ve sürecin ilgili politikaya tam uyumlu hale getirilmesi hususunda gereğini rica ederim.`;

    const splitFooter = doc.splitTextToSize(footerText, maxLineWidth);

    splitFooter.forEach((line) => {
      if (yPos > pageHeight - 15) {
        doc.addPage();
        yPos = 20;
        doc.setFont(myFontName);
        doc.setFontSize(10);
      }
      doc.text(line, margin, yPos);
      yPos += 5;
    });

    doc.save(`Tedbir_${formData.measureNumber}_Revize.pdf`);
  };

  const handleOpenGuide = () => {
    if (!formData.measureNumber)
      return toast.error("Tedbir numarası girilmemiş!");

    const pdfUrl = "/bg_rehber.pdf";
    const searchText = formData.measureNumber.trim();

    window.open(`${pdfUrl}#:~:text=${searchText}`, "_blank");
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />

          <p className="text-gray-500">Tedbir bilgileri yükleniyor...</p>
        </div>
      </div>
    );
  }

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
          className="text-red-500 hover:bg-red-50 p-2 rounded-lg flex items-center gap-2 text-sm font-medium transition"
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
              className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-100 bg-gray-50 focus:bg-white transition"
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

            <div className="flex gap-2 items-center">
              <input
                type="text"
                name="measureNumber"
                value={formData.measureNumber}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-100 bg-gray-50 focus:bg-white transition"
              />

              <div className="relative group">
                <button
                  type="button"
                  onClick={handleOpenGuide}
                  className="flex items-center gap-2 bg-blue-50 text-blue-600 border border-blue-100 px-4 py-3 rounded-lg hover:bg-blue-100 transition font-medium whitespace-nowrap"
                >
                  <BookOpen size={18} />
                  Rehberi Aç
                </button>

                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-gray-800 text-white text-xs rounded-lg py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none text-center z-10 shadow-lg">
                  PDF açıldıktan 1-2 saniye içerisinde yönlendirileceksiniz
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-gray-800 rotate-45"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-indigo-50/50 rounded-lg border border-indigo-100">
          <div>
            <label className="block text-sm font-semibold text-indigo-900 mb-1">
              2025 Durumu
            </label>

            <select
              name="status2025"
              value={formData.status2025}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-indigo-200 outline-none focus:ring-2 focus:ring-indigo-300 transition"
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
              className="w-full p-3 rounded-lg border border-purple-200 outline-none focus:ring-2 focus:ring-purple-300 transition"
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
                className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-100 transition resize-y"
                placeholder="Detayları buraya giriniz..."
              ></textarea>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-4 border-t border-gray-100 mt-4">
          <button
            type="button"
            onClick={handleCreatePDF}
            className="w-full sm:w-auto flex justify-center items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg transition shadow-lg shadow-orange-100 font-medium active:scale-95"
          >
            <FileText size={20} />
            PDF Oluştur
          </button>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg transition shadow-lg shadow-indigo-100 font-medium active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Save size={20} />
            )}
            Güncelle
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditMeasurePage;
