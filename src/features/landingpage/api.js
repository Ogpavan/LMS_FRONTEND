// Utility to fetch categories from the backend
export async function fetchCategories() {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/category`);
    if (!response.ok) throw new Error("Failed to fetch categories");
    return await response.json();
  } catch (err) {
    console.error("Error fetching categories:", err);
    return [];
  }
}
