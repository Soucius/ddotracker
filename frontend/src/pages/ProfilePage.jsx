import { useState } from "react";
import { User, Lock, Save, Loader2 } from "lucide-react";
import api from "../libs/axios.js";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const [user] = useState(JSON.parse(localStorage.getItem("user")) || {});
  const [loading, setLoading] = useState(false);

  const [passwords, setPasswords] = useState({
    password: "",
    confirmPassword: "",
  });

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwords.password !== passwords.confirmPassword) {
      return toast.error("Şifreler eşleşmiyor!");
    }
    if (passwords.password.length < 6) {
      return toast.error("Şifre en az 6 karakter olmalı.");
    }

    setLoading(true);

    try {
      await api.put(`/users/${user.id}`, { password: passwords.password });

      toast.success("Şifreniz başarıyla güncellendi.");

      setPasswords({ password: "", confirmPassword: "" });
    } catch (error) {
      console.error(error);

      toast.error("Şifre güncellenemedi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Hesap Ayarları</h1>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <User className="text-indigo-600" /> Profil Bilgileri
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-500 uppercase font-bold">
              Kullanıcı Adı
            </label>

            <p className="text-gray-900 font-medium bg-gray-50 p-2 rounded mt-1">
              {user.username}
            </p>
          </div>

          <div>
            <label className="text-xs text-gray-500 uppercase font-bold">
              E-posta
            </label>

            <p className="text-gray-900 font-medium bg-gray-50 p-2 rounded mt-1">
              {user.email}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <Lock className="text-indigo-600" /> Şifre Değiştir
        </h2>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Yeni Şifre
            </label>

            <input
              type="password"
              className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-100"
              placeholder="Yeni şifrenizi girin"
              value={passwords.password}
              onChange={(e) =>
                setPasswords({ ...passwords, password: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Yeni Şifre (Tekrar)
            </label>

            <input
              type="password"
              className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-100"
              placeholder="Şifreyi onaylayın"
              value={passwords.confirmPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, confirmPassword: e.target.value })
              }
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Save size={18} />
              )}
              Güncelle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
