import React, { useState } from "react";

const getSize = () => {
  const element = document.getElementById("tooltip");
  if (element) {
    const { width, height } = element.getBoundingClientRect();
    return { width, height };
  }
  return { width: 0, height: 0 };
};

const Tooltip = ({ children, content, position = "right", color }) => {
  const [show, setShow] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  const tooltipOffset = 10;

  const handleMouseEnter = () => setShow(true);
  const handleMouseLeave = () => setShow(false);
  const handleMouseMove = (event) => {
    const tooltipPosition = {};
    switch (position) {
      // case "top":
      //   tooltipPosition.top =
      //     event.clientY - getSize().height / 3 - tooltipOffset;
      //   tooltipPosition.left = event.clientX + tooltipOffset;
      //   break;
      case "left":
        tooltipPosition.top = event.clientY + tooltipOffset;
        tooltipPosition.left = event.clientX - getSize().width - tooltipOffset;
        break;
      // case "bottom":
      //   tooltipPosition.top = event.clientY + tooltipOffset;
      //   tooltipPosition.left = event.clientX + tooltipOffset;
      //   break;
      case "right":
      default:
        tooltipPosition.top = event.clientY + tooltipOffset;
        tooltipPosition.left = event.clientX + tooltipOffset;
        break;
    }
    setTooltipPosition(tooltipPosition);
  };

  const tooltipStyle = {
    position: "fixed",
    top: tooltipPosition.top + "px",
    left: tooltipPosition.left + "px",
    zIndex: 10,
    color: color || "white",
    fontSize: "0.8rem",
    padding: "0px 8px 0px 8px",
  };

  return (
    <div
      id='tooltip'
      className='relative'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {show && <div style={tooltipStyle}>{content}</div>}
      {children}
    </div>
  );
};

export default Tooltip;
