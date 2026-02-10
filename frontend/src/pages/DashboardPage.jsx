import { Plus, Folder, Clock, CheckCircle, AlertCircle } from "lucide-react";

const DashboardPage = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {
    username: "Misafir",
  };

  const stats = [
    {
      title: "Toplam Proje",
      value: "0",
      icon: <Folder className="text-blue-600" />,
      color: "bg-blue-100",
    },
    {
      title: "Devam Eden",
      value: "0",
      icon: <Clock className="text-yellow-600" />,
      color: "bg-yellow-100",
    },
    {
      title: "Tamamlanan",
      value: "0",
      icon: <CheckCircle className="text-green-600" />,
      color: "bg-green-100",
    },
    {
      title: "Geciken",
      value: "0",
      icon: <AlertCircle className="text-red-600" />,
      color: "bg-red-100",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Hoş Geldin, {user.username}! 👋
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            Bugün projelerinle ilgili neler yapmak istersin?
          </p>
        </div>

        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg shadow-sm transition-all active:scale-95 text-sm font-medium">
          <Plus size={18} />
          Yeni Proje Oluştur
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow"
          >
            <div className={`p-3 rounded-lg ${stat.color}`}>{stat.icon}</div>

            <div>
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">
                {stat.title}
              </p>

              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Folder className="h-8 w-8 text-gray-400" />
        </div>

        <h3 className="text-lg font-medium text-gray-900">
          Henüz bir proje yok
        </h3>

        <p className="text-gray-500 mt-1 max-w-sm mx-auto text-sm">
          Projelerini takip etmeye başlamak için yukarıdaki butonu kullanarak
          ilk projeni oluşturabilirsin.
        </p>
      </div>
    </div>
  );
};

export default DashboardPage;
