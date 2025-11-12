import { useNavigate } from "react-router-dom";

const Support = () => {
  const navigate = useNavigate();

  const options = [
    {
      title: "FAQs",
      description: "Find answers to common questions and platform usage.",
      path: "/customer-support/faqs",
    },
    {
      title: "Rework Requests",
      description: "Submit a rework or follow up on your previous requests.",
      path: "/customer-support/rework",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Customer Support
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {options.map((item) => (
          <div
            key={item.title}
            onClick={() => navigate(item.path)}
            className="cursor-pointer rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all p-6"
          >
            <h2 className="text-xl font-semibold text-blue-600 mb-2">
              {item.title}
            </h2>
            <p className="text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Support;
