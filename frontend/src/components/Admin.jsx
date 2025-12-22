import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Login from "./Login";
import Register from "./Register";

function Admin() {
  const [showRegister, setShowRegister] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Kullanıcıyı hafızadan oku
    const user = JSON.parse(localStorage.getItem("user"));
    
    // 2. Eğer kullanıcı giriş yapmışsa kontrol et
    if (user) {
      if (user.role === "admin") {
        // Admin ise Yönetim Paneline
        navigate("/admin/panel");
      } else {
        // Normal kullanıcı ise Ana Sayfaya (Mekanlar Listesine)
        navigate("/"); 
      }
    }
  }, [navigate]);

  return (
    <div>
      <Header headerText="Giriş Yap" motto="Mekanbul'a Hoşgeldiniz" />
      
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow">
              <div className="card-body">
                {showRegister ? (
                  <>
                    <Register />
                    <div className="text-center mt-3">
                      <p>Zaten hesabın var mı?</p>
                      <button 
                        className="btn btn-link" 
                        onClick={() => setShowRegister(false)}
                      >
                        Giriş Yap
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <Login />
                    <div className="text-center mt-3">
                      <p>Hesabın yok mu?</p>
                      <button 
                        className="btn btn-link" 
                        onClick={() => setShowRegister(true)}
                      >
                        Kayıt Ol
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;