import useMousePosition from "../hooks/useMousePosition";

export const Tooltip = (props: {
  visibility: boolean;
  children: JSX.Element;
}) => {
  const mousePosition = useMousePosition();

  return (
    <div
      style={{
        position: "absolute",
        left: `${mousePosition.x + 15}px`,
        top: `${mousePosition.y}px`,

        color: "black",
        backgroundColor: "white",
        borderRadius: "2px",
        display: props.visibility ? "flex" : "none",

        justifyContent: "stretch",
        flexDirection: "column",
        padding: "-1px",
        cursor: "pointer",
        border: "2px solid rgb(47, 47, 47)", // 2px border with blue color
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Added a subtle shadow

        overflow: "hidden",
        overflowX: "hidden",
        overflowY: "hidden",
      }}
    >
      {props.children}
    </div>
  );
};
