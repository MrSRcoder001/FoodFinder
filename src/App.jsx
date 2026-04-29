import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen pt-40 md:pt-28 pb-12">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:barcode" element={<ProductDetail />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
