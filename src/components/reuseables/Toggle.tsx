import React from "react";

interface ToggleProps {
  enabled: boolean;
  onToggle: (value: boolean) => void;
}

const Toggle: React.FC<ToggleProps> = ({ enabled, onToggle }) => {
  return (
    <button
      type="button"
      className={`w-14 h-8 flex items-center rounded-full p-1 
        ${enabled ? "bg-blue-600" : "bg-gray-300"}`}
      onClick={() => onToggle(!enabled)}
    >
      <div
        className={`w-6 h-6 bg-white rounded-full shadow-md transform 
          transition-transform duration-300 ease-in-out 
          ${enabled ? "translate-x-6" : "translate-x-0"}`}
      ></div>
    </button>
  );
};

export default Toggle;
