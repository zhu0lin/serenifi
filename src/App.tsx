import { AppLayout } from './components/Layout/AppLayout'
import { Map, List, Grid, Star, Clock, Users } from 'lucide-react'

function App() {
  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center py-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Find Your <span className="text-primary-600">Quiet Space</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Discover peaceful places to study, work, and relax in New York City. 
            Powered by community insights and NYC Open Data.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary text-lg px-8 py-3">
              Explore Quiet Spaces
            </button>
            <button className="btn-secondary text-lg px-8 py-3">
              How It Works
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-lg mx-auto mb-4">
              <Map size={24} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">1,200+</h3>
            <p className="text-gray-600">Quiet Locations</p>
          </div>
          <div className="card text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-secondary-100 text-secondary-600 rounded-lg mx-auto mb-4">
              <Star size={24} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">15,000+</h3>
            <p className="text-gray-600">Community Reviews</p>
          </div>
          <div className="card text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 text-green-600 rounded-lg mx-auto mb-4">
              <Users size={24} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">8,500+</h3>
            <p className="text-gray-600">Active Users</p>
          </div>
          <div className="card text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 text-purple-600 rounded-lg mx-auto mb-4">
              <Clock size={24} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">24/7</h3>
            <p className="text-gray-600">Updated Data</p>
          </div>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="card-hover">
            <div className="flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-lg mb-4">
              <Map size={24} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Interactive Map</h3>
            <p className="text-gray-600 mb-4">
              Explore quiet spaces across NYC with our interactive map. Filter by location type, 
              quiet level, and accessibility features.
            </p>
            <button className="text-primary-600 hover:text-primary-700 font-medium">
              Explore Map →
            </button>
          </div>

          <div className="card-hover">
            <div className="flex items-center justify-center w-12 h-12 bg-secondary-100 text-secondary-600 rounded-lg mb-4">
              <Star size={24} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Community Reviews</h3>
            <p className="text-gray-600 mb-4">
              Read real reviews from our community. Get insights on noise levels, 
              accessibility, and the best times to visit.
            </p>
            <button className="text-secondary-600 hover:text-secondary-700 font-medium">
              Read Reviews →
            </button>
          </div>

          <div className="card-hover">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 text-green-600 rounded-lg mb-4">
              <Users size={24} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Accessibility First</h3>
            <p className="text-gray-600 mb-4">
              Detailed accessibility information for every location. Find wheelchair-accessible 
              spaces, quiet hours, and sensory-friendly environments.
            </p>
            <button className="text-green-600 hover:text-green-700 font-medium">
              Learn More →
            </button>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-primary-600 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Find Your Quiet Space?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of New Yorkers who have discovered their perfect study and work spots.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-primary-600 hover:bg-gray-100 font-semibold px-8 py-3 rounded-lg transition-colors duration-200">
              Start Exploring
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold px-8 py-3 rounded-lg transition-colors duration-200">
              Contribute a Location
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

export default App
