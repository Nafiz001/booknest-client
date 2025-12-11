import { MapPin } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom blue marker icon
const blueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const CoverageMap = () => {
  const cities = [
    { name: 'New York', state: 'NY', libraries: 12, lat: 40.7128, lng: -74.0060 },
    { name: 'Los Angeles', state: 'CA', libraries: 9, lat: 34.0522, lng: -118.2437 },
    { name: 'Chicago', state: 'IL', libraries: 8, lat: 41.8781, lng: -87.6298 },
    { name: 'Houston', state: 'TX', libraries: 7, lat: 29.7604, lng: -95.3698 },
    { name: 'Phoenix', state: 'AZ', libraries: 6, lat: 33.4484, lng: -112.0740 },
    { name: 'Philadelphia', state: 'PA', libraries: 5, lat: 39.9526, lng: -75.1652 },
    { name: 'San Antonio', state: 'TX', libraries: 4, lat: 29.4241, lng: -98.4936 },
    { name: 'San Diego', state: 'CA', libraries: 5, lat: 32.7157, lng: -117.1611 },
    { name: 'Dallas', state: 'TX', libraries: 6, lat: 32.7767, lng: -96.7970 },
    { name: 'San Jose', state: 'CA', libraries: 4, lat: 37.3382, lng: -121.8863 },
  ];

  return (
    <section className="py-16 bg-background-light dark:bg-background-dark">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title">Our Coverage Area</h2>
          <p className="section-subtitle">
            We deliver to major cities across the country. Find out if we're in your area!
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Map Container */}
          <div className="relative bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-4 overflow-hidden shadow-xl">
            {/* Real Interactive Leaflet Map with Dynamic Markers */}
            <div className="relative h-96 rounded-xl overflow-hidden border-2 border-primary/20 shadow-lg">
              <MapContainer
                center={[39.8283, -98.5795]}
                zoom={4}
                style={{ height: '100%', width: '100%' }}
                className="z-0"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {cities.map((city, index) => (
                  <Marker 
                    key={index} 
                    position={[city.lat, city.lng]}
                    icon={blueIcon}
                  >
                    <Popup>
                      <div className="text-center">
                        <div className="font-bold text-gray-900">{city.name}, {city.state}</div>
                        <div className="text-sm text-gray-600">{city.libraries} Libraries</div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
              
              {/* Overlay Info Card */}
              <div className="absolute bottom-4 left-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-lg p-4 shadow-xl max-w-xs z-[1000]">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  Service Coverage
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  We deliver to {cities.length} major cities across the USA with {cities.reduce((sum, city) => sum + city.libraries, 0)} partner libraries
                </p>
              </div>
            </div>
          </div>

          {/* City List */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {cities.map((city, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 p-3 rounded-lg bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark hover:border-primary transition-colors duration-200"
              >
                <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                <div className="text-sm">
                  <div className="font-semibold text-gray-900 dark:text-white">{city.name}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">{city.libraries} Libraries</div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Don't see your city? We're expanding! <br />
              Request service in your area.
            </p>
            <button className="btn-primary">
              Request Coverage
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoverageMap;
