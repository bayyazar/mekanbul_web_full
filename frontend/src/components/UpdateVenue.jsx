import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Header from "./Header";

function UpdateVenue() {
  const { id } = useParams(); // URL'deki :id parametresini al
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    foodanddrink: "",
    rating: "",
  });

  // Sayfa açılınca mevcut verileri getir
  useEffect(() => {
    const fetchVenue = async () => {
      try {
        // Backend'den tek mekan bilgisini çek
        const response = await axios.get(`http://localhost:3000/api/venues/${id}`);
        const venue = response.data;

        setFormData({
          name: venue.name,
          address: venue.address,
          // Array gelen veriyi string'e çevir (virgülle göster)
          foodanddrink: venue.foodanddrink ? venue.foodanddrink.join(", ") : "",
          rating: venue.rating,
        });
      } catch (error) {
        console.error("Mekan bilgisi alınamadı", error);
      }
    };

    fetchVenue();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      
      // Veriyi backend formatına çevir
      const payload = {
          ...formData,
          foodanddrink: formData.foodanddrink.split(",").map(item => item.trim())
      };

      // PUT isteği ile güncelle
      await axios.put(`http://localhost:3000/api/venues/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Mekan başarıyla güncellendi!");
      navigate("/admin/panel"); // İşlem bitince panele dön

    } catch (error) {
      console.error("Güncelleme hatası:", error);
      alert("Hata oluştu: Yetkiniz olmayabilir.");
    }
  };

  return (
    <div>
      <Header headerText="Mekan Güncelle" motto={formData.name} />
      <div className="container mt-4">
        <div className="row justify-content-center">
            <div className="col-md-6">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Mekan Adı</label>
                    <input type="text" name="name" value={formData.name} className="form-control" onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Adres</label>
                    <input type="text" name="address" value={formData.address} className="form-control" onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">İmkanlar (Virgülle ayırın)</label>
                    <input type="text" name="foodanddrink" value={formData.foodanddrink} className="form-control" onChange={handleChange} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Puan</label>
                    <input type="number" name="rating" value={formData.rating} className="form-control" onChange={handleChange} min="0" max="5" />
                  </div>
                  <button type="submit" className="btn btn-warning w-100">Güncelle</button>
                </form>
            </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateVenue;