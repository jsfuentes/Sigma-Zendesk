import React from "react";
import PropTypes from "prop-types";

const Logo = (props) => {
  return (
    <a className="flex items-center" href="/">
      <img
        className="w-8 h-8"
        src={require("../img/logo.png")}
        alt="Slingshow Logo"
      />
      {props.showName && (
        <span className="font-medium text-lg ml-3">Slingshow</span>
      )}
    </a>
  );
};

Logo.propTypes = {
  showName: PropTypes.bool,
};

Logo.defaultProps = {
  showName: true,
};

export default Logo;
