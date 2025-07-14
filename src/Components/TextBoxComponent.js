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
                min={props.min}
                onChange={(e) => props.onChangeValue(e)}></input>
            <p className="ValidationMessage">{props.validationMessage}</p>
        </div>
    );
}

export default TextBoxComponent;
