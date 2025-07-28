function PageCard({ title, children }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold text-[#0066FF] mb-4">{title}</h2>
      {children}
    </div>
  );
}

export default PageCard;