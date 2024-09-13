const QRCode = require('qrcode');
const fs = require('fs');

const generateQRCode = async (filePath) => {
  const unicastAddress = Math.floor(Math.random() * 0xffff);  // Random 16-bit address
  const elementAddresses = [unicastAddress, unicastAddress + 1];

  const deviceData = {
    UUID: 'unique-uuid-12345',
    name: '', // This will be set by the user after scanning
    deviceKey: 'unique-device-key-12345',
    unicastAddress: unicastAddress.toString(16), // Convert to hex string
    security: 'default',
    configComplete: true,
    features: {
      relay: false,
      proxy: false,
      friend: false,
      lowPower: false,
    },
    defaultTTL: 5,
    netKeys: ['net-key-1'],
    appKeys: ['app-key-1'],
    elements: [
      { address: elementAddresses[0], state: 0 },
      { address: elementAddresses[1], state: 0 },
    ],
    blacklisted: false,
    cid: '0002',
    pid: '0002', // Lamp
    vid: '0001',
    crpl: 0,
    networkTransmit: { count: 3, interval: 20 },
    deviceType: 'lamp',
    element_adress: elementAddresses,
    element_State: [0, 0], // Default states
    Humidity: null,
    Temperature: null,
    Luminosity: null,
    Occupancy: null,
    Batterie: null,
    Chrono: null,
    Eclat: null,
  };

  await QRCode.toFile(filePath, JSON.stringify(deviceData), {
    color: {
      dark: '#000',  // Black dots
      light: '#FFF',  // White background
    },
  });

  console.log('QR code generated successfully!');
};

// Call the function to generate the QR code
generateQRCode('./device-qrcode.png');