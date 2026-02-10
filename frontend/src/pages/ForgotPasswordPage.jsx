import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Key,
  ArrowRight,
  CheckCircle,
  Loader2,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../libs/axios.js";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSendCode = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      await api.post("/users/forgot-password", { email });

      toast.success("Doğrulama kodu e-postana gönderildi!");

      setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || "Kod gönderilemedi.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      await api.post("/users/verify-otp", { email, otp });

      toast.success("Kod doğrulandı, yeni şifreni belirle.");

      setStep(3);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Kod hatalı veya süresi dolmuş.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      await api.post("/users/reset-password", { email, newPassword });

      toast.success("Şifren başarıyla güncellendi! Giriş yapabilirsin.");

      navigate("/signin");
    } catch (error) {
      toast.error(error.response?.data?.message || "Şifre güncellenemedi.");
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
          <div className="bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600">
            {step === 1 && <Mail className="h-8 w-8" />}
            {step === 2 && <Key className="h-8 w-8" />}
            {step === 3 && <CheckCircle className="h-8 w-8" />}
          </div>

          <h2 className="text-2xl font-bold text-gray-900">
            {step === 1 && "Şifreni mi Unuttun?"}
            {step === 2 && "Kodu Doğrula"}
            {step === 3 && "Yeni Şifre Belirle"}
          </h2>

          <p className="text-gray-500 mt-2 text-sm">
            {step === 1 &&
              "Endişelenme, e-posta adresini gir, sana doğrulama kodu gönderelim."}
            {step === 2 &&
              `Lütfen ${email} adresine gönderilen 6 haneli kodu gir.`}
            {step === 3 && "Hesabın için güçlü bir yeni şifre oluştur."}
          </p>
        </div>

        {step === 1 && (
          <form onSubmit={handleSendCode} className="space-y-5">
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
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@email.com"
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-lg shadow-lg shadow-indigo-200 transition-all flex justify-center items-center gap-2"
            >
              {loading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <>
                  Kod Gönder <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Doğrulama Kodu
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-gray-400" />
                </div>

                <input
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  maxLength={6}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 transition-all outline-none tracking-widest text-lg font-semibold text-center"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-lg shadow-lg shadow-indigo-200 transition-all flex justify-center items-center gap-2"
            >
              {loading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                "Doğrula ve İlerle"
              )}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-sm text-gray-500 hover:text-gray-700 mt-2"
            >
              E-postayı yanlış mı girdin? Düzenle
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Yeni Şifre
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>

                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-lg shadow-lg shadow-green-200 transition-all flex justify-center items-center gap-2"
            >
              {loading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                "Şifreyi Güncelle"
              )}
            </button>
          </form>
        )}

        <div className="mt-8 text-center pt-6 border-t border-gray-100">
          <Link
            to="/signin"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Giriş Sayfasına Dön
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
