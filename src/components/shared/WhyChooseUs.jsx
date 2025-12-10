import { Truck, Clock, Shield, HeadphonesIcon, BookOpen, Users } from 'lucide-react';

const WhyChooseUs = () => {
  const features = [
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Get your books delivered within 24-48 hours to your doorstep with real-time tracking.',
    },
    {
      icon: Clock,
      title: 'Flexible Returns',
      description: 'No rush! Keep books for up to 30 days and return them at your convenience.',
    },
    {
      icon: Shield,
      title: 'Secure & Safe',
      description: 'Your personal information and payments are protected with industry-standard encryption.',
    },
    {
      icon: HeadphonesIcon,
      title: '24/7 Support',
      description: 'Our dedicated support team is always ready to help you with any questions or concerns.',
    },
    {
      icon: BookOpen,
      title: 'Vast Collection',
      description: 'Access to thousands of books across all genres from multiple library partners.',
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Join a thriving community of readers. Share reviews and discover new favorites.',
    },
  ];

  return (
    <section className="py-16 bg-surface-light dark:bg-surface-dark">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title">Why Choose BookNest?</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            We're more than just a delivery service. We're your partner in creating a seamless reading experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-xl border-2 border-transparent hover:border-primary bg-background-light dark:bg-background-dark transition-all duration-300 hover:shadow-lg"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                <feature.icon className="w-8 h-8 text-primary group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">10K+</div>
            <div className="text-gray-600 dark:text-gray-400">Books Available</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">5K+</div>
            <div className="text-gray-600 dark:text-gray-400">Happy Readers</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">50+</div>
            <div className="text-gray-600 dark:text-gray-400">Library Partners</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">99%</div>
            <div className="text-gray-600 dark:text-gray-400">Customer Satisfaction</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
