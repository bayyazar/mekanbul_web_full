import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

function AddVenue() {
  const navigate = useNavigate();
  
  // Form verilerini tutacak state
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    foodanddrink: "", // Kullanıcıdan string olarak alacağız, gönderirken diziye çevireceğiz
    rating: ""
  });

  // Input değişikliklerini yakalayan fonksiyon
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Form gönderildiğinde çalışacak fonksiyon
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Token'ı al (Admin yetkisi için şart)
      const token = localStorage.getItem("token");
      
      if (!token) {
        alert("Oturum süreniz dolmuş, lütfen tekrar giriş yapın.");
        navigate("/admin");
        return;
      }

      // Backend'in beklediği formatı hazırla
      const payload = {
          name: formData.name,
          address: formData.address,
          rating: formData.rating || 0, // Puan girilmezse 0 olsun
          // Virgülle ayrılan metni diziye çevir ve boşlukları temizle
          // Örnek: "Çay, Kahve " -> ["Çay", "Kahve"]
          foodanddrink: formData.foodanddrink.split(",").map(item => item.trim())
      };

      // POST isteği gönder
      await axios.post("http://localhost:3000/api/venues", payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Mekan başarıyla eklendi!");
      navigate("/admin/panel"); // İşlem bitince panele dön

    } catch (error) {
      console.error("Ekleme hatası:", error);
      alert("Hata: " + (error.response?.data?.message || "Mekan eklenirken bir sorun oluştu."));
    }
  };

  return (
    <div>
      <Header headerText="Yeni Mekan Ekle" motto="Veritabanına Kayıt" />
      
      <div className="container mt-4">
        <div className="row justify-content-center">
            <div className="col-md-6">
                <div className="card shadow-sm">
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                          {/* Mekan Adı */}
                          <div className="mb-3">
                            <label className="form-label">Mekan Adı</label>
                            <input 
                                type="text" 
                                name="name" 
                                className="form-control" 
                                placeholder="Örn: Starbucks"
                                onChange={handleChange} 
                                required 
                            />
                          </div>

                          {/* Adres */}
                          <div className="mb-3">
                            <label className="form-label">Adres</label>
                            <input 
                                type="text" 
                                name="address" 
                                className="form-control" 
                                placeholder="Örn: SDÜ Batı Kampüsü"
                                onChange={handleChange} 
                                required 
                            />
                          </div>

                          {/* İmkanlar */}
                          <div className="mb-3">
                            <label className="form-label">İmkanlar (Virgülle ayırın)</label>
                            <input 
                                type="text" 
                                name="foodanddrink" 
                                className="form-control" 
                                placeholder="Örn: Çay, Kahve, Wifi, Kek"
                                onChange={handleChange} 
                            />
                            <small className="text-muted">Özellikleri virgül ile ayırarak yazınız.</small>
                          </div>

                          {/* Puan (Opsiyonel) */}
                          <div className="mb-3">
                            <label className="form-label">Başlangıç Puanı</label>
                            <input 
                                type="number" 
                                name="rating" 
                                className="form-control" 
                                placeholder="0-5 arası"
                                min="0" 
                                max="5" 
                                onChange={handleChange} 
                            />
                          </div>

                          <div className="d-grid gap-2">
                              <button type="submit" className="btn btn-primary">Kaydet</button>
                              <button 
                                type="button" 
                                className="btn btn-secondary"
                                onClick={() => navigate("/admin/panel")}
                              >
                                İptal
                              </button>
                          </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

export default AddVenue;