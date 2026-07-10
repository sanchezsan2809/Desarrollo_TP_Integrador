import './Header.css';

const Header = ({ username }) => {

  return (
    <header className="top-header">

      <div className="top-header-left">

        <span className="header-item emergency">
          EMERGENCIAS: 0810-333-0004
        </span>

        <span className="divider" id="divisor1">|</span>

        <span className="header-item" id="beneficiarios">
          BENEFICIARIOS: 0800-666-0400
        </span>

        <span className="divider" id="divisor2">|</span>

        <span className="header-item" id="turnos">
          TURNOS: 0810-999-0101
        </span>

        <span className="divider" id="divisor3">|</span>

        <span className="header-item" id="contacto">
          CONTACTO
        </span>

      </div>

      <div className="top-header-right">

        <span className="header-user">
          {
            username
              ? `Hola ${username}!`
              : 'Grog grog!'
          }
        </span>

      </div>

    </header>
  );
};

export default Header;