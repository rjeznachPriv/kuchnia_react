import './../Styles/TextBoxComponent.css';

function TextBoxComponent(props) {
    return (
        <div>
            <label htmlFor={props.id}>{props.label}</label>
            <input
                type={props.type ? props.type : "text"}
                placeholder={props.placeholder}
                id={props.id}
                value={props.value}
                min="0"
                onChange={(e) => props.onChangeValue(e)}></input>
            <p className="ValidationMessage">validation msg</p>
        </div>
    );
}

export default TextBoxComponent;
