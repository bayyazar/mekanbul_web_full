// CSS dosyasını içe aktar
import "./App.css";

// React kütüphanesini içe aktar
import React from "react";

// React DOM'u içe aktar (uygulamayı HTML'e bağlamak için)
import ReactDOM from "react-dom/client";

// Sayfa bileşenlerini içe aktar
import Template from "./components/Template"; // Ana şablon (header, footer vb.)
import Home from "./components/Home"; // Ana sayfa
import VenueDetail from "./components/VenueDetail"; // Mekan detay sayfası
import AddComment from "./components/AddComment"; // Yorum ekleme sayfası
import About from "./components/About"; // Hakkında sayfası
import PageNotFound from "./components/PageNotFound"; // 404 sayfa bulunamadı


// React Router bileşenlerini içe aktar (sayfa yönlendirme için)
// BrowserRouter: Tarayıcının URL'sini kullanarak sayfa geçişlerini yönetir (örn: /home, /about)
// Routes: Tüm Route bileşenlerini bir arada tutan kapsayıcı
// Route: Her bir URL yolunu (path) ilgili bileşene (component) bağlar
import { Routes, Route, BrowserRouter } from "react-router-dom";

// Redux store'u içe aktar (uygulama durumunu yönetmek için)
import store from "./redux/store.jsx";

// Redux Provider'ı içe aktar (store'u tüm bileşenlere erişilebilir yapmak için)
import { Provider } from "react-redux";

// Uygulamayı başlat ve "root" id'li HTML elementine bağla
ReactDOM.createRoot(document.getElementById("root")).render(
  // Redux store'u tüm uygulamaya sağla
  <Provider store={store}>
    {/* Tarayıcı tabanlı yönlendirme yapılandırması */}
    <BrowserRouter
      future={{
        v7_relativeSplatPath: true, // React Router v7 özelliği
        v7_startTransition: true, // React Router v7 özelliği
      }}
    >
      {/* Tüm rotaları tanımla */}
      <Routes>
        {/* Ana şablon içinde tüm sayfalar */}
        {/* Template: Tüm sayfalar için ortak yapı (header, navbar, footer vb.) */}
        <Route path="/" element={<Template />}>
          {/* Ana sayfa - "/" yolu */}
          {/* Home bileşeni Template'in içinde gösterilir (nested route) */}
          {/* Yani "/" adresinde hem Template hem de Home birlikte render edilir */}
          <Route path="/" element={<Home />} />
          
          {/* Mekan detay sayfası - "/venue/123" gibi */}
          <Route path="venue/:id" element={<VenueDetail />} />
          
          {/* Yorum ekleme sayfası - "/venue/123/comment/new" gibi */}
          <Route path="venue/:id/comment/new" element={<AddComment />} />
          
          {/* Hakkında sayfası - "/about" yolu */}
          <Route path="about" element={<About />} />
          
          {/* Bulunamayan tüm sayfalar için 404 */}
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </Provider>
);
