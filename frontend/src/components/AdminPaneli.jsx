import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import useIdleTimer from "../hooks/useIdleTimer"; // Hook'u oluşturduğun yoldan çağır

function AdminPanel() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 1. ADIM: 10 Saniye Hareketsizlik Sayacı (Sadece bu sayfada aktif)
  useIdleTimer(10000); 

  // 2. ADIM: Sayfa Yüklendiğinde Çalışacak Kodlar
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    // Güvenlik Duvarı: Giriş yapmamışsa veya Admin değilse Login'e at
    if (!user || user.role !== "admin") {
      navigate("/admin"); 
      return;
    }

    // Mekanları Getir
    const fetchVenues = async () => {
      try {
        // Backend'den tüm mekan listesini istiyoruz
        // Not: API adresini kendi backend portuna göre ayarla (localhost:3000 vb.)
        const response = await axios.get("http://localhost:3000/api/venues"); 
        
        // Gelen veriyi state'e kaydet
        setVenues(response.data);
      } catch (error) {
        console.error("Veri çekme hatası:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, [navigate]);

  // 3. ADIM: Mekan Silme Fonksiyonu
  const handleDelete = async (id, venueName) => {
    // Kullanıcıdan onay al
    if (window.confirm(`${venueName} mekanını silmek istediğinize emin misiniz?`)) {
      try {
        const token = localStorage.getItem("token");
        
        // Backend'e "SİL" isteği gönder (Header'da token ile)
        await axios.delete(`http://localhost:3000/api/venues/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Backend'den hata gelmediyse, listeyi (state) güncelle
        // Sayfayı yenilemeye gerek kalmadan satırı listeden uçurur
        setVenues(venues.filter((venue) => venue._id !== id));
        alert("Mekan başarıyla silindi.");

      } catch (error) {
        console.error("Silme hatası:", error);
        alert("Silme işlemi başarısız. Yetkinizi kontrol edin.");
      }
    }
  };

  // Yükleniyor ekranı
  if (loading) return (
    <div>
        <Header headerText="Yönetim Paneli" motto="Yükleniyor..." />
        <div className="text-center mt-5">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Yükleniyor...</span>
            </div>
        </div>
    </div>
  );

  return (
    <div>
      <Header headerText="Yönetim Paneli" motto="Mekanları Yönet" />

      <div className="container mt-5">
        
        {/* Üst Kısım: Başlık ve Ekle Butonu */}
        <div className="row mb-4">
            <div className="col-md-6">
                 <h3 className="text-secondary">Mekan Listesi</h3>
            </div>
            <div className="col-md-6 text-end">
                <Link to="/admin/addvenue" className="btn btn-success">
                    <span className="glyphicon glyphicon-plus"></span> Yeni Mekan Ekle
                </Link>
            </div>
        </div>

        {/* Tablo Bölümü */}
        {venues.length === 0 ? (
          <div className="alert alert-warning">Sistemde kayıtlı hiç mekan bulunamadı.</div>
        ) : (
          <div className="table-responsive shadow-sm">
            <table className="table table-hover table-striped mb-0">
              <thead className="bg-primary text-white">
                <tr>
                  <th>Mekan Adı</th>
                  <th>Adres</th>
                  <th>Puan</th>
                  <th className="text-center">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {venues.map((venue) => (
                  <tr key={venue._id}>
                    <td className="fw-bold">{venue.name}</td>
                    <td>{venue.address}</td>
                    <td>
                      <span className="label label-warning">
                        {venue.rating}
                      </span>
                    </td>
                    <td className="text-center">
                      <div className="btn-group" role="group">
                        {/* Güncelleme Butonu */}
                        <Link 
                          to={`/admin/updatevenue/${venue._id}`} 
                          className="btn btn-info btn-xs"
                          style={{ marginRight: "5px" }}
                        >
                          Düzenle
                        </Link>
                        
                        {/* Silme Butonu */}
                        <button 
                          onClick={() => handleDelete(venue._id, venue.name)} 
                          className="btn btn-danger btn-xs"
                        >
                          Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Alt Kısım: Çıkış Butonu */}
        <div className="mt-4 text-end border-top pt-3">
            <button 
                className="btn btn-default"
                onClick={() => {
                    localStorage.clear(); // Token ve user silinir
                    navigate("/admin"); // Giriş sayfasına atılır
                }}
            >
                Güvenli Çıkış
            </button>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;