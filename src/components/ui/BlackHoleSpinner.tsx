import React from "react";
import "../styles/PsychedelicSpinner.css";

const BlackHoleSpinner = () => (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999]">
    <div className="loader">

      {[...Array(5)].map((_, i) => (
        <div key={i} className="star" style={{ '--i': i } as React.CSSProperties} />
      ))}

      <div>
        <span />
        <span />
        <span />
        <span />
      </div>
    </div>
  </div>
);

export default BlackHoleSpinner;
