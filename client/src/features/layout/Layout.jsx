import { Outlet } from "react-router-dom";
import Header from "../../components/header/Header.jsx";
import Navbar from "../../components/header/Navbar.jsx";
import MedicoNavbar from "../../components/medicoNavbar/MedicoNavbar.jsx";
import Footer from "../../components/footer/Footer.jsx";
import "./Layout.css";
import { useAuth } from "../../context/AuthContext.jsx";

const Layout = (/*{ carrito }*/) => {

  const { user } = useAuth()

  console.log(user)

    return (
        <div className="layout-container">
        <Header
          username={user?.usuario.nombre}
        />
        {
            user?.rol === "MEDICO"
            ? <MedicoNavbar />
            : <Navbar />
        }
          
          <main className="main-content">
            <Outlet />
          </main>

          <Footer />
        </div>
    );
};

export default Layout;