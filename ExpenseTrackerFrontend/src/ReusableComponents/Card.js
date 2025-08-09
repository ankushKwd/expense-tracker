const Card = ({ children, title, className = "" }) => (
  <div className={`bg-white shadow-lg rounded-lg p-6 mb-6 ${className}`}>
    {title && (
      <h2 className="text-xl font-semibold mb-4 text-gray-800">{title}</h2>
    )}
    {children}
  </div>
);

export default Card;
