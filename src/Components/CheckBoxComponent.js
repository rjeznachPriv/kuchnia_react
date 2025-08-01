import './../Styles/CheckBoxComponent.css';

function CheckBoxComponent(props) {
    return (
        <span>
            <input
                type="checkbox"
                checked={props.value}
                onChange={props.onChange}>
            </input> {props.label}
        </span>
    );
}

export default CheckBoxComponent;

