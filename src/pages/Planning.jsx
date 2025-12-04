import React, { useState } from 'react';

function Planning() {
  const [count, setCount] = useState(0);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Planning</h1>
      
      <div className="mb-4">Compteur : {count}</div>
      
      <button
        onClick={() => setCount(count + 1)}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition"
      >
        +1
      </button>
    </div>
  );
}

export default Planning;
