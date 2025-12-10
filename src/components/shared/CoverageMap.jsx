import { MapPin } from 'lucide-react';

const CoverageMap = () => {
  const cities = [
    { name: 'New York', state: 'NY', libraries: 12, top: '35%', left: '85%' },
    { name: 'Los Angeles', state: 'CA', libraries: 9, top: '58%', left: '15%' },
    { name: 'Chicago', state: 'IL', libraries: 8, top: '42%', left: '70%' },
    { name: 'Houston', state: 'TX', libraries: 7, top: '72%', left: '52%' },
    { name: 'Phoenix', state: 'AZ', libraries: 6, top: '65%', left: '25%' },
    { name: 'Philadelphia', state: 'PA', libraries: 5, top: '38%', left: '82%' },
    { name: 'San Antonio', state: 'TX', libraries: 4, top: '75%', left: '48%' },
    { name: 'San Diego', state: 'CA', libraries: 5, top: '68%', left: '12%' },
    { name: 'Dallas', state: 'TX', libraries: 6, top: '68%', left: '52%' },
    { name: 'San Jose', state: 'CA', libraries: 4, top: '48%', left: '10%' },
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
          <div className="relative bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 overflow-hidden shadow-xl">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            {/* USA Map Silhouette */}
            <div className="relative h-96 bg-white/50 dark:bg-gray-900/50 rounded-xl backdrop-blur-sm border-2 border-primary/20">
              {/* City Markers */}
              {cities.map((city, index) => (
                <div
                  key={index}
                  className="absolute group cursor-pointer animate-fade-in"
                  style={{ 
                    top: city.top, 
                    left: city.left,
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  {/* Marker Pin */}
                  <div className="relative">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg hover:scale-125 transition-transform duration-200 border-4 border-white dark:border-gray-800">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    
                    {/* Pulse Animation */}
                    <div className="absolute inset-0 w-8 h-8 bg-primary rounded-full animate-ping opacity-25"></div>
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                      <div className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-xl">
                        <div className="font-semibold">{city.name}, {city.state}</div>
                        <div className="text-xs opacity-75">{city.libraries} Libraries</div>
                        {/* Arrow */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                          <div className="border-8 border-transparent border-t-gray-900 dark:border-t-white"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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
