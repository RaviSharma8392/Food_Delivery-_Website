import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createCategory } from "../../../services/admin/category";
const AddCategory = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return toast.warn("⚠️ Category name is required.");

    setLoading(true);
    try {
      const res = await createCategory({ name, image });

      if (res.success) {
        toast.success("✅ Category created successfully!");
        setName("");
        setImage("");
      } else {
        toast.error("❌ Failed to create category.");
      }
    } catch (err) {
      toast.error("❌ Error: " + (err.message || "Something went wrong."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-center">Add New Category</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Category Name</label>
          <input
            type="text"
            className="w-full border rounded-md p-2 mt-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Burgers"
          />
        </div>
        <div>
          <label className="block font-semibold">Image URL (optional)</label>
          <input
            type="text"
            className="w-full border rounded-md p-2 mt-1"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
          {loading ? "Saving..." : "Add Category"}
        </button>
      </form>

      <ToastContainer position="top-right" autoClose={3000} pauseOnHover />
    </div>
  );
};

export default AddCategory;
