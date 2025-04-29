const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition">
    <div className="mb-3">{icon}</div>
    <h3 className="text-xl font-semibold text-indigo-300 mb-2">{title}</h3>
    <p className="text-gray-400 text-sm">{description}</p>
  </div>
);
export default FeatureCard;