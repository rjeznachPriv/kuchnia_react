import './../Styles/TextBoxComponent.css';

function TextBoxComponent(props) {
    return (
        <div className={props.className}>
            <label htmlFor={props.id}>{props.label}</label>
            <input
                type={props.type ? props.type : "text"}
                placeholder={props.placeholder}
                id={props.id}
                value={props.value}
                min={props.min}
                onChange={props.onChange}></input>
            <span>{props.additional}</span>
            <p className="ValidationMessage">{props.validationMessage}</p>
        </div>
    );
}

export default TextBoxComponent;

export function renderTextBoxComponent(column, commonProps, captions, additional) {
    return (
        <span className="display-flex">
            <TextBoxComponent
                {...commonProps}
                placeholder={`${captions.message_add} ${column.displayName}`}
                type={column.type}
                min={column.min}
                max={column.max}
                additional={additional}
            />
        </span>
    );
}
