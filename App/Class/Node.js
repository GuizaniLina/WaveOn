export default class Node {
    constructor(data) {
      this.UUID = data.UUID;
      this.name = data.name;
      this.deviceKey = data.deviceKey;
      this.unicastAddress = parseInt(data.unicastAddress, 16)||data.unicast;
      this.security = data.security;
      this.configComplete = data.configComplete;
      this.features = data.features;
      this.defaultTTL = data.defaultTTL;
      this.netKeys = data.netKeys;
      this.appKeys = data.appKeys;
      this.elements =[];
      this.blacklisted = data.blacklisted;
      this.cid = data.cid;
      this.pid = parseInt(data.pid, 16);
      this.vid = data.vid;
      this.crpl = data.crpl;
      this.networkTransmit = data.networkTransmit;
      this.deviceType= data.deviceType || null;

      this.element_adress = data.element_adress ||[];
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
    }*/generateElementAddresses(unicastAddress, numberOfElements) {
      let addresses = [];
      for (let i = 0; i < numberOfElements; i++) {
          addresses.push(unicastAddress + i);
      }
      return addresses;
  }

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

      getElementAddresses() {
        return this.element_adress.length > 0 ? this.element_adress : [];
      }
    
      getElementStates() {
        return this.element_State.length > 0 ? this.element_State : [];
      }

      updateFromDevice(updatedDevice) {
        if (updatedDevice.unicastAddress !== this.unicastAddress) {
          console.warn(`Unicast address mismatch: expected ${this.unicastAddress}, got ${updatedDevice.unicastAddress}`);
          // You can return early or handle the mismatch case here if needed
          return;
      }
      
        if (updatedDevice.Temperature != null) 
          this.Temperature = parseInt(updatedDevice.Temperature.toString().slice(0, 2));
       
       
      if (updatedDevice.Humidity != null)
        this.Humidity = parseInt(updatedDevice.Humidity.toString().slice(0, 2));
       
      if (updatedDevice.Occupancy != null)   this.Occupancy = updatedDevice.Occupancy;
      
      if (updatedDevice.Luminosity != null) this.Luminosity = updatedDevice.Luminosity;
        
      if (updatedDevice.Chrono != null)  this.Chrono = (updatedDevice.Chrono + 32768)   ;
       
      if (updatedDevice.Batterie != null) this.Batterie = updatedDevice.Batterie ;
        
      if (updatedDevice.Eclat != null) this.Eclat = updatedDevice.Eclat ;
     
      if (updatedDevice.elements != null){
        // Met à jour les états des éléments selon leurs adresses
        updatedDevice.elements.forEach(element => {
         if (element.state != null) {
          const normalizedState = Math.floor(((element.state + 32768) / 65535) * 100);
           const index = this.element_adress.indexOf(element.address);
           if (index !== -1) {
             // Mettez à jour l'état à l'index correspondant
             this.element_State[index] = normalizedState;
           } else {
             // Si l'adresse n'existe pas dans le tableau, ajoutez-la avec son état
             this.element_adress.push(element.address);
             this.element_State.push(normalizedState);
           }
         }
       });
    }
              }
   
            }