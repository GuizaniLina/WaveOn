import pingService from './pingService';

export const startPeriodicPing = (idclient, iduser, token,navigation) => {
  // Perform initial ping
  performPing(idclient, iduser, token,navigation);

  // Set up interval to perform ping every 10 seconds
  const pingInterval = setInterval(() => {
    performPing(idclient, iduser, token,navigation);
  }, 500000);

  // Return a function to clear the interval when needed
  return () => clearInterval(pingInterval);
};

// Function to perform ping
export const performPing = async (idclient, iduser, token,navigation) => {
  try {
    await pingService(idclient, iduser, token,navigation);
    console.log('Ping successful');
  } catch (error) {
    console.error('Ping error:', error);
  }
};