type Props={
    title: string;
    value: string | number;
};

const Card = ({title, value}: Props) => {
    return(
        <div style={{
            border: "1px solid #ddd",
             borderRadius: "8px",
             padding: "20px",
             width: "150px",
            textAlign: "center"}}>
            <h3>{title}</h3>
            <p>{value}</p>
        </div>
    );
};

export default Card;