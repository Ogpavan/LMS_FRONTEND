// Utility to fetch categories from the backend
export async function fetchCategories() {
  try {
    const response = await fetch("http://localhost:5000/api/category");
    if (!response.ok) throw new Error("Failed to fetch categories");
    return await response.json();
  } catch (err) {
    console.error("Error fetching categories:", err);
    return [];
  }
}
