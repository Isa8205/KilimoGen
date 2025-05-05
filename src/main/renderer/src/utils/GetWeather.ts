import axios from "axios";

const fetchWeather = async () => {
    const googleApiKey = 'YOUR_GOOGLE_API_KEY';
    const weatherApiKey = '35a9e104e838dab0e5f4dafad596ad2b';

    const getLocation = () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              console.log(`Geolocation: Latitude: ${latitude}, Longitude: ${longitude}`);
            },
            async () => {
              console.error("Geolocation permission denied. Falling back to IP-based location.");
              const response = await axios.get("https://ipapi.co/json/");
              const data = await response.data;
              console.log(`IP Location: ${data.city}, ${data.region}, ${data.country}`);
              console.log(`Latitude: ${data.latitude}, Longitude: ${data.longitude}`);
            }
          );
        } else {
          console.error("Geolocation is not supported by this browser.");
        }
      };
      
      getLocation();
  
    // Step 1: Get latitude and longitude from Google Geocoding API
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${googleApiKey}`;
    const geocodeResponse = await fetch(geocodeUrl);
    const geocodeData = await geocodeResponse.json();
    const { lat, lng } = geocodeData.results[0].geometry.location;
  
    // Step 2: Get weather data using OpenWeatherMap API
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${weatherApiKey}&units=metric`;
    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();
  
    // Step 3: Display weather information
    console.log(`Weather in ${weatherData.name}:`);
    console.log(`Temperature: ${weatherData.main.temp}°C`);
    console.log(`Condition: ${weatherData.weather[0].description}`);
  };

  
