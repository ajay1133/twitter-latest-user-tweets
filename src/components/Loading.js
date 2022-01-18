import React from "react";
import loading from "../assets/loading.svg";

const Loading = ({ hideSpinner = false, className = '' }) => {
  console.log('className = ', className, hideSpinner);
  if (!(className && typeof className === 'string')) {
    className = '';
  }
  if (hideSpinner) {
    return (
      <div className={className}>
        <img src={loading} alt="Loading" />
      </div>
    );
  }
  className += className && !className.includes('spinner') ? `spinner ${className}` : 'spinner';
  return (
    <div className={className}>
      <img src={loading} alt="Loading" />
    </div>
  );
}

export default Loading;
