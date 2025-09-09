import API_BASE_URL from "./api";

export const fetchProjects = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/projects`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
};
