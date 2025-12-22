import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Backend'e istek at
      const response = await axios.post("http://localhost:3000/api/login", loginData);
      
      if (response.data.token) {
        // Token ve Kullanıcıyı kaydet
        localStorage.setItem("token", response.data.token);
        
        // Backend'den gelen user objesini kaydet (role bilgisini içerdiğinden emin ol)
        // Örnek: { name: "Ahmet", email: "...", role: "user" }
        localStorage.setItem("user", JSON.stringify(response.data.user));

        // --- YÖNLENDİRME MANTIĞI BURADA ---
        if (response.data.user.role === "admin") {
           // Admin ise Panele
           console.log("Admin girişi başarılı");
           navigate("/admin/panel");
        } else {
           // Normal user ise Ana Sayfaya
           console.log("Kullanıcı girişi başarılı");
           navigate("/"); 
        }
      }
    } catch (error) {
      console.error("Giriş hatası", error);
      alert("E-posta veya şifre hatalı!");
    }
  };

  return (
    <div>
        <h3 className="text-center mb-3">Giriş Yap</h3>
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label>Email</label>
                <input type="email" name="email" className="form-control" onChange={handleChange} required />
            </div>
            <div className="mb-3">
                <label>Şifre</label>
                <input type="password" name="password" className="form-control" onChange={handleChange} required />
            </div>
            <button type="submit" className="btn btn-primary w-100">Giriş Yap</button>
        </form>
    </div>
  );
}

export default Login;