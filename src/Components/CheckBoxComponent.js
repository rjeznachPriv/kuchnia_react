import './../Styles/CheckBoxComponent.css';

function CheckBoxComponent(props) {
    return (
        <span>
            <label>{props.label}</label>
            <input
                type="checkbox"
                checked={props.value}
                onChange={props.onChange}>
            </input> 
        </span>
    );
}

export default CheckBoxComponent;

export function renderCheckBoxComponent(commonProps, setter, value) {
    return (
        <div>
            
            <CheckBoxComponent
                {...commonProps}
                onChange={(e) => { setter(!value); }}
            ></CheckBoxComponent>
        </div>
    );
}