export const parseDevices = (automationTargets) => {
    return automationTargets.split(';').filter(Boolean).map(target => {
      const [deviceName, elementAddress, unicastAddress] = target.split(':');
      const deviceKey = `${deviceName}-${elementAddress === unicastAddress ? 'A' : 'B'}`;
      return deviceKey;
    });
  };
  
  export const parseCondition = (automationTriggers) => {
    const [deviceName, unicastAddress, plan, condition, operator, value] = automationTriggers.split(':');
    return condition;
  };
  
  export const parseOperator = (automationTriggers) => {
    const [deviceName, unicastAddress, plan, condition, operator, value] = automationTriggers.split(':');
    return operator;
  };
  
  export const parseValue = (automationTriggers) => {
    const [deviceName, unicastAddress, plan, condition, operator, value] = automationTriggers.split(':');
    return value;
  };
  
  export const parseDeviceStates = (automationTargets) => {
    const deviceStates = {};
    automationTargets.split(';').filter(Boolean).forEach(target => {
      const [deviceName, elementAddress, unicastAddress, value] = target.split(':');
      const deviceKey = `${deviceName}-${elementAddress === unicastAddress ? 'A' : 'B'}`;
      deviceStates[deviceKey] = value === '100' ? 'on' : value === '0' ? 'off' : value;
    });
    return deviceStates;
  };
  
  export const parseSelectedDays = (automationTimes) => {
    return automationTimes.split(';').filter(Boolean).map(time => {
      const [timeString, day, period] = time.split('#');
      return parseInt(day, 10);
    });
  };
  
  export const parseAmPm = (automationTimes) => {
    const period = automationTimes.split(';')[0]?.split('#')[2];
    return period === '0' ? 'PM' : 'AM';
  };
  
  export const parseDeclencheur = (automationTriggers) => {
    const [deviceName] = automationTriggers.split(':');
    return déclencheurData.find(item => item.label === deviceName)?.key || null;
  };
  
  export const parseShowPlanification = (automationTriggers) => {
    const [, , plan] = automationTriggers.split(':');
    return plan === '1';
  };