import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';
import { WebView } from 'react-native-webview';
import { useTranslation } from 'react-i18next'; // Import the useTranslation hook

// Import the SVG constants
import * as SvgIcons from './svgIcons'; // Adjust the path as needed

const WeatherComponent = () => {
  const { t } = useTranslation(); // Use the t function for translations
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg(t('location_denied'));
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      if (location) {
        fetchWeather(location.coords.latitude, location.coords.longitude);
      }
    })();
  }, []);

  const fetchWeather = async (latitude, longitude) => {
    const apiKey = '8072e7f755e170def1ad5ee79c3aa0dd';
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

    try {
      const response = await fetch(url);
      const json = await response.json();
      setWeather(json);
    } catch (error) {
      setErrorMsg(t('weather_fetch_error'));
      console.error(error);
    }
  };

  const getWeatherIcon = (iconCode) => {
    switch (iconCode) {
      case '01d':
        return SvgIcons.ClearDaySVG;
      case '01n':
        return SvgIcons.ClearNightSVG;
      case '02d':
        return SvgIcons.FewCloudsDaySVG;
      case '02n':
        return SvgIcons.FewCloudsNightSVG;
      case '03d':
        return SvgIcons.ScatteredCloudsDaySVG;
      case '03n':
        return SvgIcons.ScatteredCloudsNightSVG;
      case '04d':
        return SvgIcons.BrokenCloudsDaySVG;
      case '04n':
        return SvgIcons.BrokenCloudsNightSVG;
      case '09d':
        return SvgIcons.ShowerRainDaySVG;
      case '09n':
        return SvgIcons.ShowerRainNightSVG;
      case '10d':
        return SvgIcons.RainDaySVG;
      case '10n':
        return SvgIcons.RainNightSVG;
      case '11d':
        return SvgIcons.ThunderstormDaySVG;
      case '11n':
        return SvgIcons.ThunderstormNightSVG;
      case '13d':
        return SvgIcons.SnowDaySVG;
      case '13n':
        return SvgIcons.SnowNightSVG;
      case '50d':
        return SvgIcons.MistDaySVG;
      case '50n':
        return SvgIcons.MistNightSVG;
      default:
        return SvgIcons.ClearDaySVG;
    }
  };

  return (
    <LinearGradient colors={['#58c487', 'rgba(112, 160, 214, 1)']} style={styles.container}>
      {errorMsg ? <Text style={styles.paragraph}>{errorMsg}</Text> : null}
      {location ? (
        <>
          <View style={styles.weatherContainer}>
            <View style={styles.weatherInfo}>
              {weather && (
                <>
                  <Text style={styles.temperatureText}>{weather.main.temp}°C</Text>
                  <Text style={styles.weatherDescription}>{weather.weather[0].description}</Text>
                  <Text style={styles.sunriseText}>{t('sunrise')}{new Date(weather.sys.sunrise * 1000).toLocaleTimeString()}</Text>
                  <Text style={styles.sunsetText}>{t('sunset')}{new Date(weather.sys.sunset * 1000).toLocaleTimeString()}</Text>
                </>
              )}
            </View>
            {weather && (
              <WebView
                originWhitelist={['*']}
                source={{ html: `
                  <html>
                    <body style="margin: 0; padding: 0; background: transparent; display: flex; justify-content: center; align-items: center;">
                      <div style="width: 100%; height: 100%; max-width: 500px; max-height: 500px;">
                        ${getWeatherIcon(weather.weather[0].icon)}
                      </div>
                    </body>
                  </html>` }}
                style={styles.webview}
                javaScriptEnabled={true}
                backgroundColor="transparent"
              />
            )}
          </View>
        </>
      ) : (
        <Text style={styles.paragraph}>{t('fetching_location')}</Text>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    margin: 20,
    height: 150,
  },
  webview: {
    backgroundColor: 'transparent',
  },
  paragraph: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  weatherContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 10,
  },
  weatherInfo: {},
  temperatureText: {
    fontSize: 40,
    color: '#fff',
    fontWeight: 'bold',
  },
  weatherDescription: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  sunriseText: {
    fontSize: 10,
    color: '#fff',
    marginBottom: 5,
  },
  sunsetText: {
    fontSize: 10,
    color: '#fff',
  },
});

export default WeatherComponent;