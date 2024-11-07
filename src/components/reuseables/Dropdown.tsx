import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightFromBracket,
  faCog,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

type option = {
  name: string;
  link?: string;
  icon?: any;
};

interface DropdownProps extends option {
  onSelect: (option: option) => void;
}

const options: option[] = [
  { name: "Settings", link: "/settings", icon: faCog },
  { name: "Logout", icon: faRightFromBracket },
];

const Dropdown: React.FC<DropdownProps> = ({ onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleOptionClick = (option: option) => {
    onSelect(option);

    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      {!isOpen ? (
        <FontAwesomeIcon
          onClick={toggleDropdown}
          className="px-4 py-2 text-sm font-medium text-black "
          icon={faBars}
        />
      ) : (
        <FontAwesomeIcon
          onClick={toggleDropdown}
          className="px-4 py-2 text-sm font-medium text-black "
          icon={faTimes}
        />
      )}
      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionClick(option)}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100"
              >
                <span className="pr-3">{option.name}</span>
                <FontAwesomeIcon icon={option.icon} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
