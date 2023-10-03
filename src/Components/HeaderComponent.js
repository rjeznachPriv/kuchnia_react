import './../Styles/HeaderComponent.css';

function HeaderComponent(props) {
    return (
        <header id="app-top-header"> { props.title } </header>
  );
}

export default HeaderComponent;
