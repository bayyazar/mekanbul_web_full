import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register({ setShowRegister }) { // setShowRegister prop'unu Admin.jsx'ten alabiliriz (iptal butonu için)
  const navigate = useNavigate();

  // 1. ADIM: Form verilerini tutacak state'i tanımlıyoruz
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Hata veya başarı mesajlarını göstermek için state
  const [message, setMessage] = useState("");

  // 2. ADIM: Inputlara girilen veriyi anlık olarak state'e kaydediyoruz
  const handleChange = (e) => {
    setFormData({
      ...formData,             // Mevcut diğer verileri koru
      [e.target.name]: e.target.value // Değişen inputun ismine göre değeri güncelle
    });
  };

  // 3. ADIM: Form gönderildiğinde (Submit) çalışacak fonksiyon
  const handleSubmit = async (e) => {
    e.preventDefault(); // Sayfanın yenilenmesini engelle
    setMessage(""); // Mesajları temizle

    try {
      // Backend'e kayıt isteği gönderiyoruz
      // NOT: Backend rotanın '/api/register' olduğunu varsayıyoruz.
      const response = await axios.post("http://localhost:3000/api/register", formData);

      if (response.status === 201 || response.status === 200) {
        alert("Kayıt başarılı! Şimdi giriş yapabilirsiniz.");
        
        // Kayıt başarılıysa, Giriş formunu açması için sayfayı yenilemeden state değiştirebiliriz
        // Veya window.location.reload() ile login ekranına düşmesini sağlayabiliriz.
        window.location.reload(); 
      }

    } catch (error) {
      console.error("Kayıt hatası:", error);
      setMessage("Kayıt başarısız! " + (error.response?.data?.message || "Bir hata oluştu."));
    }
  };

  return (
    <div>
      <h3 className="text-center mb-3">Kayıt Ol</h3>
      
      {/* Hata Mesajı Gösterimi */}
      {message && <div className="alert alert-danger">{message}</div>}

      <form onSubmit={handleSubmit}>
        {/* İsim Alanı */}
        <div className="mb-3">
          <label className="form-label">Ad Soyad</label>
          <input
            type="text"
            name="name"
            className="form-control"
            placeholder="Adınızı giriniz"
            value={formData.name} // State ile inputu bağlıyoruz (Controlled Component)
            onChange={handleChange}
            required
          />
        </div>

        {/* Email Alanı */}
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="ornek@email.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Şifre Alanı */}
        <div className="mb-3">
          <label className="form-label">Şifre</label>
          <input
            type="password"
            name="password"
            className="form-control"
            placeholder="******"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Kaydı Tamamla
        </button>
      </form>
    </div>
  );
}

export default Register;