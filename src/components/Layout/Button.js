import React from "react";

const Button = (props) => {
  const classes =
    props.type === "code"
      ? "border px-3 rounded-full bg-sky-950 text-white"
      : "border px-3 rounded-full bg-sky-500 text-white";

  return (
    <button type="button" onClick={props.onClickEven} className={classes}>
      {props.children}
    </button>
  );
};

export default Button;
