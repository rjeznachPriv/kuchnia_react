import './../Styles/TextBoxComponent.css';

function TextBoxComponent(props) {
    return (
        <div>
            <label htmlFor={props.id}>{props.label}</label>
            <input
                type="text"
                placeholder={props.value}
                required
                
                onChange={(e) => props.onChangeValue(e)}></input>
            <p className="ValidationMessage">validation msg</p>
        </div>
    );
}

export default TextBoxComponent;
