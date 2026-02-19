import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import toast from "react-hot-toast";
import api from "../libs/axios.js";

const SigninPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await api.post("/users/signin", formData);
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success(`Hoş geldin, ${user.username}!`);

      navigate("/dashboard");
    } catch (error) {
      console.error("Login Error:", error);

      const message =
        error.response?.data?.message || "Giriş yapılırken bir hata oluştu.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden px-4">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>

      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Tekrar Hoşgeldiniz
          </h2>

          <p className="text-gray-500 mt-2 text-sm">
            Kaldığınız yerden devam etmek için giriş yapın.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              E-posta Adresi
            </label>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>

              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="ornek@email.com"
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Şifre
              </label>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-12 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-400 hover:text-indigo-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            <div className="text-right mt-2">
              <Link
                to="/forgot-password"
                className="text-xs font-medium text-indigo-600 hover:text-indigo-500 hover:underline transition-all"
              >
                Şifreni mi unuttun?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white font-bold py-3.5 rounded-lg shadow-lg shadow-indigo-200 transition-all flex justify-center items-center gap-2
              ${
                loading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5 active:scale-95"
              }`}
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Giriş Yapılıyor...
              </>
            ) : (
              <>
                <LogIn className="h-5 w-5" />
                Giriş Yap
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            Henüz bir hesabın yok mu?{" "}
            <Link
              to="/signup"
              className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
            >
              Hemen Kayıt Ol
            </Link>
          </p>

          <div className="mt-3">
            <span className="text-xs text-gray-500">
              This web application created by{" "}
              <a
                href="https://github.com/Soucius"
                target="_blank"
                className="text-indigo-600"
              >
                <i>Soucius</i>
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SigninPage;
