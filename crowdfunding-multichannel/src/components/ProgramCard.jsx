import React from "react";

const ProgramCard = ({
  title,
  image,
  description,
  isSelected,
  onToggle,
}) => {
  return (
    <div 
      className={`program-item p-4 rounded-lg transition transform duration-200 ${isSelected ? "active border-blue" : "border-gray-300"}`}
      onClick={onToggle}
    >
      <div className="program-plus-i" style={{ color: 'rgb(49, 138, 243)' }}>
        <svg 
          stroke="currentColor" 
          fill="none" 
          strokeWidth="2" 
          viewBox="0 0 24 24" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          height="20" 
          width="20" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </div>
      <img src={image} alt={title} className="w-12 h-12" />
      <div className="program-caption mt-2 flex flex-col">
        <span className="title">{title}</span>
        <span className="sub-title">{description}</span>
      </div>
    </div>
  );
};

export default ProgramCard;