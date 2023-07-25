import "./AddressComponent.scss";

type Props = {
    address: string;
    className?: string;
    maxWidth?: string;
};

function AddressComponent(props: Props) {
    return (
        <span className={`AddressComponent ${props.className ? props.className : ""}`}
            style={{maxWidth: props.maxWidth ? props.maxWidth : "auto"}}>
            {props.address}
        </span>
    );
}
export default AddressComponent;