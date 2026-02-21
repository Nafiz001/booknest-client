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
    <section className="section-wrap bg-surface-light dark:bg-surface-dark">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="section-title">Why Choose BookNest?</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            We're more than just a delivery service. We're your partner in creating a seamless reading experience.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group rounded-xl border border-border-light bg-background-light p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-card-hover dark:border-border-dark dark:bg-background-dark"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 transition-all duration-300 group-hover:scale-105 group-hover:bg-primary">
                <feature.icon className="h-7 w-7 text-primary transition-colors duration-300 group-hover:text-white" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-2 gap-6 md:grid-cols-4">
          <div className="rounded-xl border border-border-light bg-background-light p-5 text-center dark:border-border-dark dark:bg-background-dark">
            <div className="text-4xl font-bold text-primary mb-2">10K+</div>
            <div className="text-gray-600 dark:text-gray-400">Books Available</div>
          </div>
          <div className="rounded-xl border border-border-light bg-background-light p-5 text-center dark:border-border-dark dark:bg-background-dark">
            <div className="text-4xl font-bold text-primary mb-2">5K+</div>
            <div className="text-gray-600 dark:text-gray-400">Happy Readers</div>
          </div>
          <div className="rounded-xl border border-border-light bg-background-light p-5 text-center dark:border-border-dark dark:bg-background-dark">
            <div className="text-4xl font-bold text-primary mb-2">50+</div>
            <div className="text-gray-600 dark:text-gray-400">Library Partners</div>
          </div>
          <div className="rounded-xl border border-border-light bg-background-light p-5 text-center dark:border-border-dark dark:bg-background-dark">
            <div className="text-4xl font-bold text-primary mb-2">99%</div>
            <div className="text-gray-600 dark:text-gray-400">Customer Satisfaction</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
