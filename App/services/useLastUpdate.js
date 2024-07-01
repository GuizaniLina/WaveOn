import { useState } from 'react';

const useLastUpdate = () => {
  const [lastUpdate, setLastUpdate] = useState("2019-10-01 01:01:01");

  // Function to update the last update timestamp
  const updateLastUpdate = (newTimestamp) => {
    setLastUpdate(newTimestamp);
  };

  return {
    lastUpdate,
    updateLastUpdate
  };
};

export default useLastUpdate;