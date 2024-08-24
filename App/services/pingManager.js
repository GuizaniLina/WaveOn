import pingService from './pingService';

export const startPeriodicPing = (idclient, iduser, token) => {
  // Perform initial ping
  performPing(idclient, iduser, token);

  // Set up interval to perform ping every 10 seconds
  const pingInterval = setInterval(() => {
    performPing(idclient, iduser, token);
  }, 600000);

  // Return a function to clear the interval when needed
  return () => clearInterval(pingInterval);
};

// Function to perform ping
export const performPing = async (idclient, iduser, token) => {
  try {
    await pingService(idclient, iduser, token);
    console.log('Ping successful');
  } catch (error) {
    console.error('Ping error:', error);
  }
};