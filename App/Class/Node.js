export default class Node {
    constructor(data) {
      this.UUID = data.UUID;
      this.name = data.name;
      this.deviceKey = data.deviceKey;
      this.unicastAddress = data.unicastAddress;
      this.security = data.security;
      this.configComplete = data.configComplete;
      this.features = data.features;
      this.defaultTTL = data.defaultTTL;
      this.netKeys = data.netKeys;
      this.appKeys = data.appKeys;
      this.elements = data.elements;
      this.blacklisted = data.blacklisted;
      this.cid = data.cid;
      this.pid = data.pid;
      this.vid = data.vid;
      this.crpl = data.crpl;
      this.networkTransmit = data.networkTransmit;


      this.element_adress = data.element_adress || [];
    this.element_State = data.element_State || [];
    this.Humidity = null ;
    this.Temperature = null;
    this.Luminosity = null;
    this.Occupancy =null;
    this.Batterie =null;
    this.Chrono =null ;
    this.Eclat = null;
    }
  
    // Méthodes pour manipuler les données du Node
  /*  getIcon() {
      switch (this.pid) {
        case "0000":
          return require('../../assets/icons/volet.png');
        case "0001":
          return require('../../assets/icons/remote_dark.png');
        case "0002":
          return require('../../assets/icons/lampe_dark.png');
        case "0003":
          return require('../../assets/icons/lampe1.png');
        // Ajoutez d'autres cas si nécessaire
        default:
          return require('../../assets/icons/default_icon.png');
      }
    }*/
  
    // Méthode pour obtenir les valeurs du slider
 /*   getSliderValues() {
      switch (this.pid) {
        case "0000":
          return { min: 0, max: 100 };
        case "0001":
          return { min: 0, max: 50 };
        // Ajoutez d'autres cas si nécessaire
        default:
          return { min: 0, max: 100 };
      }
    }*/
  
    // Méthode pour obtenir les icônes d'information
   /* getInfoIcons() {
      switch (this.pid) {
        case "0000":
          return [
            { icon: require('../../assets/icons/oeil.png'), color: 'rgba(74, 207, 244, 1)', value: '--' },
            { icon: require('../../assets/icons/temperatures.png'), color: 'rgba(240, 69, 32, 1)', value: '--' },
            { icon: require('../../assets/icons/humidite.png'), color: 'rgba(41, 43, 234, 1)', value: '--' },
            { icon: require('../../assets/icons/luminosite.png'), color: 'rgba(244, 231, 74, 1)', value: '--' },
          ];
        // Ajoutez d'autres cas si nécessaire
        default:
          return [];
      }
    }*/

    getHumidity() {
      if  (this.Humidity == null)  this.Humidity='--'  ;
      return this.Humidity;
        
      }
    
      getTemperature() {
        if  (this.Temperature == null)  this.Temperature='--'  ;
        return this.Temperature;
      }
    
      getLuminosity() {
        if  (this.Luminosity == null)  this.Luminosity='--'  ;
        return this.Luminosity;
      }
    
      getOccupancy() {
        if  (this.Occupancy == null)  this.Occupancy='--'  ;
        return this.Occupancy;
      }

      getChrono() {
        if  (this.Chrono == null)  this.Chrono='--'  ;
        return this.Chrono;
      }
      getEclat() {
        if  (this.Eclat == null)  this.Eclat='--'  ;
        return this.Eclat;
      }
      getBatterie() {
        if  (this.Batterie == null)  this.Batterie='--'  ;
        return this.Batterie;
      }

      updateFromDevice(updatedDevice) {
        this.temperature = updatedDevice.temperature;
        this.humidity = updatedDevice.humidity;
        this.Occupancy = updatedDevice.Occupancy;
        this.Luminosity = updatedDevice.Luminosity;
        this.Chrono = updatedDevice.Chrono;
        this.Batterie = updatedDevice.Batterie;
        this.Eclat = updatedDevice.Eclat;
        
      }
    }
  