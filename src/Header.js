import './Header.css';

function Header(props) {
    return (
        <header id="app-top-header"> { props.title } </header>
  );
}

export default Header;
