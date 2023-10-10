import './../Styles/SuppliesComponent.css';
import names from "./../Configuration/VitalHTMLids.json";

function SuppliesComponent(props) {
    var localStyle = { display: props.activeTab === names.supplies_tab ? 'block' : 'none' };
    return (
        <div id="supplies-component" className="" style={localStyle}></div>
  );
}

export default SuppliesComponent;
