<template>
  <div class="container mt-5">
    <div v-if="error" class="alert alert-danger mx-auto" style="max-width: 500px;">
      {{ error }}
    </div>
    
    <div class="header text-center mb-4">
      <h1 class="display-4">WEATHER APP</h1>
      <div class="search-bar d-flex justify-content-center mb-3">
        <input 
          type="text" 
          v-model="city"
          placeholder="Enter city name (e.g. Clayton, AU)"
          class="form-control w-50 me-2"
          @keyup.enter="searchByCity"
        />
        <button @click="searchByCity" class="btn btn-primary">
          <i class="bi bi-search me-1"></i>Search
        </button>
      </div>
      <div class="examples">
        <small class="text-muted">Try: Clayton, AU | London, UK | New York, US</small>
      </div>
    </div>

    <main class="weather-card card p-4 mx-auto" style="max-width: 500px;">
      <div v-if="weatherData">
        <h2 class="text-center">
          {{ weatherData.name }}, {{ weatherData.sys.country }}
        </h2>
        <div class="text-center my-4">
          <img :src="iconUrl" alt="Weather Icon" class="weather-icon mb-3" />
          <p class="display-3 fw-bold">{{ temperature }}°C</p>
        </div>
        <div class="text-center">
          <span class="fs-5 text-capitalize">
            {{ weatherData.weather[0].description }}
          </span>
          <div class="weather-details mt-4">
            <div class="row">
              <div class="col-4">
                <div class="detail-item">
                  <i class="bi bi-droplet"></i>
                  <span>Humidity</span>
                  <strong>{{ weatherData.main.humidity }}%</strong>
                </div>
              </div>
              <div class="col-4">
                <div class="detail-item">
                  <i class="bi bi-wind"></i>
                  <span>Wind</span>
                  <strong>{{ weatherData.wind.speed }} m/s</strong>
                </div>
              </div>
              <div class="col-4">
                <div class="detail-item">
                  <i class="bi bi-speedometer"></i>
                  <span>Pressure</span>
                  <strong>{{ weatherData.main.pressure }} hPa</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="loading" class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2">Loading weather data...</p>
      </div>
      <div v-else class="text-center text-muted">
        <i class="bi bi-cloud-sun fs-1 mb-3"></i>
        <p>Enter a city name to get current weather information</p>
      </div>
    </main>
    
    <div class="recent-searches mt-4" v-if="recentSearches.length">
      <h5 class="text-center mb-3">Recent Searches</h5>
      <div class="d-flex justify-content-center flex-wrap">
        <button 
          v-for="(search, index) in recentSearches" 
          :key="index"
          class="btn btn-outline-primary btn-sm me-2 mb-2"
          @click="searchAgain(search)"
        >
          {{ search }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { ref, watch } from 'vue';

export default {
  name: "WeatherView",
  setup() {
    const city = ref("Clayton, AU");
    const weatherData = ref(null);
    const loading = ref(false);
    const error = ref(null);
    const recentSearches = ref([]);
    
    // 使用有效的API密钥
    const apikey = "5ebbe13e18085b36d47c2f80806e7078";
    
    const temperature = ref(0);
    const iconUrl = ref("");

    watch(weatherData, (newVal) => {
      if (newVal) {
        temperature.value = newVal.main.temp;
        iconUrl.value = `https://openweathermap.org/img/wn/${newVal.weather[0].icon}@2x.png`;
      }
    });

    const fetchWeatherData = async (url) => {
      try {
        loading.value = true;
        error.value = null;
        const response = await axios.get(url);
        
        if (response.data.cod !== 200) {
          throw new Error(response.data.message || "Unknown API error");
        }
        
        weatherData.value = response.data;
        
        // 添加到最近搜索
        if (city.value && !recentSearches.value.includes(city.value)) {
          if (recentSearches.value.length >= 5) {
            recentSearches.value.pop();
          }
          recentSearches.value.unshift(city.value);
        }
      } catch (err) {
        if (err.response) {
          if (err.response.status === 401) {
            error.value = "Invalid API key. Please check your key.";
          } else if (err.response.status === 404) {
            error.value = "City not found. Please try another name.";
          } else {
            error.value = `Error ${err.response.status}: ${err.response.data.message}`;
          }
        } else if (err.request) {
          error.value = "Network error. Please check your connection.";
        } else {
          error.value = err.message || "Failed to fetch weather data.";
        }
        console.error("Error details:", err);
      } finally {
        loading.value = false;
      }
    };

    const searchByCity = () => {
      if (city.value.trim()) {
        // 格式化城市名称
        const formattedCity = city.value.trim().replace(/\s*,\s*/g, ',');
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${formattedCity}&appid=${apikey}&units=metric`;
        fetchWeatherData(url);
      } else {
        error.value = "Please enter a city name";
      }
    };
    
    const searchAgain = (searchTerm) => {
      city.value = searchTerm;
      searchByCity();
    };

    // 初始搜索Clayton, AU
    searchByCity();

    return {
      city,
      weatherData,
      loading,
      error,
      temperature,
      iconUrl,
      recentSearches,
      searchByCity,
      searchAgain
    };
  }
};
</script>

<style scoped>
.weather-card {
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
  transition: all 0.3s ease;
}

.weather-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.weather-icon {
  width: 120px;
  height: 120px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  padding: 10px;
}

.search-bar {
  margin-bottom: 15px;
}

.form-control:focus {
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
  border-color: #86b7fe;
}

.detail-item {
  padding: 10px;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 10px;
}

.detail-item i {
  font-size: 1.5rem;
  color: #0d6efd;
  display: block;
  margin-bottom: 5px;
}

.detail-item span {
  display: block;
  font-size: 0.9rem;
  color: #6c757d;
}

.detail-item strong {
  font-size: 1.1rem;
  color: #212529;
}

.examples {
  margin-top: 10px;
}

.recent-searches {
  max-width: 600px;
  margin: 0 auto;
  padding: 15px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
}

@media (max-width: 768px) {
  .search-bar {
    flex-direction: column;
  }
  
  .search-bar .form-control {
    width: 100% !important;
    margin-bottom: 10px;
  }
  
  .detail-item {
    margin-bottom: 10px;
  }
}
</style>