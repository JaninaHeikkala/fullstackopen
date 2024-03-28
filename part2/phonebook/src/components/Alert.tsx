import React from "react";
import "../css/global.css";

const Alert = ({ message, type, showAlert }) => {
  if (message === null) {
    return null
  };

  return (
    <>
      {showAlert ? (
        <div className={type}> {/* "success" or "error" */}
        {message}
      </div>
      ) : (null)}
    </>
  )
}

export default Alert