import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800">
      <nav className="w-full py-6 px-8 flex justify-between items-center max-w-7xl mx-auto">
        <div className="text-2xl font-bold tracking-wider text-indigo-600">
          DDO<span className="text-gray-900">TRACKER</span>
        </div>

        <div className="flex gap-4">
          <Link
            to="/signin"
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
          >
            Giriş Yap
          </Link>

          <Link
            to="/signup"
            className="px-5 py-2.5 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
          >
            Kayıt Ol
          </Link>
        </div>
      </nav>

      <main className="flex-grow flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>

        <div className="absolute top-10 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

        <div className="relative z-10 max-w-3xl mx-auto space-y-8">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 leading-tight">
            Verilerinizi{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Akıllıca
            </span>{" "}
            Takip Edin.
          </h1>

          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            DDO Tracker ile projelerinizi, görevlerinizi ve süreçlerinizi tek
            bir yerden yönetin. Basit, hızlı ve tamamen sizin kontrolünüzde.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link
              to="/signup"
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-lg font-bold text-white bg-gray-900 hover:bg-gray-800 transition-transform transform hover:-translate-y-1 shadow-xl"
            >
              Hemen Başla
            </Link>

            <Link
              to="/signin"
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-lg font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors border border-gray-200"
            >
              Hesabım Var
            </Link>
          </div>
        </div>
      </main>

      <footer className="w-full py-6 text-center text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} DDO Tracker. Tüm hakları saklıdır.
      </footer>
    </div>
  );
};

export default HomePage;
