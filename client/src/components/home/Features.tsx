import { FaUser, FaVideo, FaSearch, FaCalendarAlt, FaChartLine, FaComments } from "react-icons/fa";

export default function Features() {
  const features = [
    {
      icon: <FaUser className="w-6 h-6" />,
      title: "Player Profiles",
      description: "Create detailed profiles showcasing your skills, achievements, and career goals. Perfect for Nigerian players looking to make their mark in football."
    },
    {
      icon: <FaVideo className="w-6 h-6" />,
      title: "Video Highlights",
      description: "Upload match highlights and training videos. Let scouts see your talent in action, from local league matches to national team performances."
    },
    {
      icon: <FaSearch className="w-6 h-6" />,
      title: "Talent Discovery",
      description: "Scouts can search through Nigeria's pool of talent using advanced filters for position, age, location, and playing style."
    },
    {
      icon: <FaCalendarAlt className="w-6 h-6" />,
      title: "Trial Management",
      description: "Academies can post trials and manage applications. Players can apply for trials at top Nigerian clubs and international opportunities."
    },
    {
      icon: <FaChartLine className="w-6 h-6" />,
      title: "Performance Analytics",
      description: "Track your progress with detailed statistics and performance metrics. Compare your stats with other players in your age group."
    },
    {
      icon: <FaComments className="w-6 h-6" />,
      title: "Secure Messaging",
      description: "Connect directly with scouts and academies through our secure messaging system. Discuss opportunities and next steps in your football journey."
    }
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Platform Features</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to discover, develop, and showcase Nigerian football talent
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-block bg-primary/10 rounded-full px-6 py-3">
            <p className="text-primary font-medium">
              Trusted by top Nigerian clubs including Enyimba FC, Kano Pillars, and Rivers United
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
