const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchMembers() {
  const res = await fetch(`${API_URL}/api/members`);
  if (!res.ok) throw new Error("Failed to fetch members");
  return res.json();
}

export async function fetchItems() {
  const res = await fetch(`${API_URL}/api/items`);
  if (!res.ok) throw new Error("Failed to fetch items");
  return res.json();
}
