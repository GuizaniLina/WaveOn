import pingService from './pingService';

const pingViewModel = async () => {
  try {
    const pingResponse = await pingService();
       // Further processing of the ping response
       const {
        id,
        value,
        networkUpdated,
        permissionsUpdated,
        roomsUpdated,
        automationUpdated,
        securityUpdated,
        isadmin,
        isgateway,
        version,
        link,
        subscriptionType,
        commands
      } = pingResponse;
  
      // Perform additional processing or transformation of the data as needed
      // For example, you could format the response or extract specific fields
  
      const formattedResponse = {
        id,
        value,
        metadata: {
          networkUpdated,
          permissionsUpdated,
          roomsUpdated,
          automationUpdated,
          securityUpdated,
          isadmin,
          isgateway,
          version,
          link,
          subscriptionType
        },
        commands // Keep commands if needed
      };
  
  
    return pingResponse;
  } catch (error) {
    throw error;
  }
};

export default pingViewModel;