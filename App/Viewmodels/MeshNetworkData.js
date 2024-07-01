export default class MeshNetworkData {
    constructor(data) {
      this.lastUpdate = data.lastUpdate || '';
      this.nodes = data.nodes || [];
      this.status = data.status || 'unknown';
    }
  
    // Method to validate the structure
    static validate(data) {
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid data format');
      }
      if (!data.lastUpdate || !Array.isArray(data.nodes) || !data.status) {
        throw new Error('Missing required fields');
      }
    }
  
    // Method to parse data from raw JSON
    static fromJson(json) {
      const data = JSON.parse(json);
      MeshNetworkData.validate(data);
      return new MeshNetworkData(data);
    }
  
    // Method to convert the instance back to JSON
    toJson() {
      return JSON.stringify({
        lastUpdate: this.lastUpdate,
        nodes: this.nodes,
        status: this.status,
      });
    }
  }