import React from 'react';

const Spinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-3 pt-3">
      <div className="loader ease-linear rounded-full border-4 border-t-4 border-t-gray-700 h-14 w-14"></div>
    </div>
  );
};

export default Spinner;
