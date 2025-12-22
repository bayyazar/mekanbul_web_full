import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useIdleTimer = (timeout = 10000) => { // Varsayılan 10 saniye (10000 ms)
  const navigate = useNavigate();

  useEffect(() => {
    let timer;

    // Kullanıcı çıkış işlemleri
    const handleLogout = () => {
      console.log("Süre doldu, çıkış yapılıyor...");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login"); // Login'e at
      window.location.reload(); // State'leri temizlemek için yenile
    };

    // Sayacı sıfırlama fonksiyonu
    const resetTimer = () => {
      if (localStorage.getItem("user")) { // Sadece giriş yapmışsa çalışsın
          clearTimeout(timer);
          timer = setTimeout(handleLogout, timeout);
      }
    };

    // Takip edilecek olaylar (Mouse hareketi, klavye basımı, tıklama)
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);

    // İlk açılışta sayacı başlat
    resetTimer();

    // Temizlik (Component kapanırsa eventleri sil)
    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
    };
  }, [navigate, timeout]);
};

export default useIdleTimer;