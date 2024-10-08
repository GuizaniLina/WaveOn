class automation {
  static TEMPERATURE = 0;
  static HUMIDITY = 1;
  static OCCUPANCY = 2;
  static LUMINOSITY = 3;

  static PIR_SENSOR = 1;
  static EXTERNAL_SENSOR = 2;
  static POWER_CUT = 3;

  static GREATER = 0;
  static EQUAL = 1;
  static LESS = 2;


    // Descriptions statiques
    static TARGET_TYPE_DESCRIPTIONS = {
      '-2': 'Mixed',
      '-1': 'Phone',
      '0': 'Lampe',
      '1': 'Outlet',
      '2': 'Dual Lampe',
      '3': 'Blinds',
      '5': 'Micro Dual Bulb',
      '6': 'Micro Blinds',
      '7': 'Micro Switch Module',
      '8': 'Micro Gate Controller',
      // Ajoutez d'autres types cibles si nécessaire
    };
  
    static EVENT_TYPE_DESCRIPTIONS = {
      '0': 'On Request',
      '1': 'Network',
      '2': 'Schedule',
      '3': 'External API',
      '4': 'Alarm',
    };
  
    static STATE_DESCRIPTIONS = {
      '0': 'Inactive',
      '1': 'Active',
    };
  
    constructor(data) {
      this.idAutomation= data.idAutomation;
      this.idNetwork =data.idNetwork;
      this.name = data.name;
      this.targetType = data.targetType;
      this.eventType = data.eventType;
      this.state = data.state;
      this.automationTargets = data.automationTargets;
      this.automationTimes = data.automationTimes;
      this.automationTriggers = data.automationTriggers;
    }
  
    // Fonction pour déterminer l'état actif
    isActive() {
      return this.state === 1;
    }
  
    // Fonction pour obtenir une description basée sur targetType
    getTargetTypeDescription() {
      return automation.TARGET_TYPE_DESCRIPTIONS[this.targetType] || 'Unknown Target Type';
    }
  
    // Fonction pour obtenir une description basée sur eventType
    getEventTypeDescription() {
      return automation.EVENT_TYPE_DESCRIPTIONS[this.eventType] || 'Unknown Event Type';
    }
  
    // Fonction pour obtenir une description basée sur l'état
    getStateDescription() {
      return automation.STATE_DESCRIPTIONS[this.state] || 'Unknown State';
    }
  
    // Fonction pour analyser les triggers
    parseTriggers(triggerType) {
      if (this.triggers.includes(triggerType)) {
        return `Detected ${triggerType}`;
      }
      return null;
    }
  }
  
  export default automation;