import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);
const API_BASE = import.meta.env.VITE_API_BASE_URL;

interface Faq {
  id: string;       // Guid()
  question: string;
  answer: string;
  category: number; // int
}

const Faqs: React.FC = () => {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch all FAQs
  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No access token found");

      const res = await fetch(
        `${API_BASE}/faq/get-all-faq-list?PageNumber=1&PageSize=18`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error(`Failed to fetch FAQs (${res.status})`);

      const data = await res.json();

      const faqList = Array.isArray(data?.data?.data)
        ? data.data.data
        : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data)
        ? data
        : [];

      setFaqs(faqList);
    } catch (err: any) {
      MySwal.fire("Error", err.message || "Failed to fetch FAQs", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  // Create new FAQ
  const handleCreateFaq = async () => {
    const { value } = await MySwal.fire({
      title: "Add New FAQ",
      html: `
        <input id="faq-question" class="swal2-input" placeholder="Question" />
        <input id="faq-answer" class="swal2-input" placeholder="Answer" />
        <input id="faq-category" type="number" class="swal2-input" placeholder="Category ID" />
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Create",
      preConfirm: () => {
        const question = (document.getElementById("faq-question") as HTMLInputElement)?.value.trim();
        const answer = (document.getElementById("faq-answer") as HTMLInputElement)?.value.trim();
        const categoryInput = (document.getElementById("faq-category") as HTMLInputElement)?.value.trim();
        const category = categoryInput ? parseInt(categoryInput) : 0;

        if (!question || !answer) {
          MySwal.showValidationMessage("Please enter both question and answer");
          return null;
        }

        return { question, answer, category };
      },
    });

    if (!value) return;

    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_BASE}/faq/create-faq`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(value),
      });

      const data = await res.json();

      if (data?.isSuccess) {
        MySwal.fire("Success", "FAQ created successfully", "success");
        fetchFaqs();
      } else {
        throw new Error(data?.message || "Failed to create FAQ");
      }
    } catch (err: any) {
      MySwal.fire("Error", err.message || "Something went wrong", "error");
    }
  };

  // Delete FAQ
  const handleDeleteFaq = async (id: string) => {
    const confirm = await MySwal.fire({
      title: "Are you sure?",
      text: "This FAQ will be deleted permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch(`${API_BASE}/faq/faqs/${id}`, {
          method: "DELETE",
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error(`Failed to delete FAQ (${res.status})`);

        MySwal.fire("Deleted!", "FAQ has been deleted.", "success");
        setFaqs(faqs.filter((faq) => faq.id !== id));
      } catch (err: any) {
        MySwal.fire("Error", err.message || "Failed to delete FAQ", "error");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600 text-lg">
        Loading FAQs...
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Frequently Asked Questions</h1>
        <button
          onClick={handleCreateFaq}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
        >
          + Add FAQ
        </button>
      </div>

      <div className="bg-white shadow-md rounded-xl p-6 overflow-x-auto">
        {faqs.length === 0 ? (
          <div className="text-center text-gray-500 py-8">No FAQs found.</div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b bg-gray-100 text-left">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Question</th>
                <th className="py-3 px-4">Answer</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {faqs.map((faq, index) => (
                <tr key={faq.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4 font-medium text-gray-800">{faq.question}</td>
                  <td className="py-3 px-4 text-gray-600">{faq.answer}</td>
                  <td className="py-3 px-4">{faq.category}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleDeleteFaq(faq.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Faqs;
