// localStorage-based mock service for portfolio management

export const createPortfolio = async (data) => {
  console.log("MOCK CREATE CALLED", data);

  const existing = JSON.parse(localStorage.getItem("portfolios") || "[]");

  const newPortfolio = {
    id: Date.now().toString(),
    name: data?.name || "My Portfolio",
    createdAt: new Date().toISOString(),
    ...data
  };

  const updated = [...existing, newPortfolio];

  localStorage.setItem("portfolios", JSON.stringify(updated));

  console.log("MOCK CREATE: Portfolio saved:", newPortfolio);
  return { data: newPortfolio };
};

export const getAllPortfolios = async () => {
  const data = JSON.parse(localStorage.getItem("portfolios") || "[]");
  console.log("MOCK FETCH:", data);
  return { data };
};

export const getPortfolioById = async (id) => {
  const portfolios = JSON.parse(localStorage.getItem("portfolios") || "[]");
  const portfolio = portfolios.find(p => p.id === id);
  console.log("MOCK GET BY ID:", id, portfolio);
  return { data: portfolio };
};

export const updatePortfolio = async (id, data) => {
  const portfolios = JSON.parse(localStorage.getItem("portfolios") || "[]");
  const index = portfolios.findIndex(p => p.id === id);
  
  if (index !== -1) {
    portfolios[index] = { ...portfolios[index], ...data };
    localStorage.setItem("portfolios", JSON.stringify(portfolios));
    console.log("MOCK UPDATE: Portfolio updated:", portfolios[index]);
    return { data: portfolios[index] };
  }
  
  console.log("MOCK UPDATE: Portfolio not found:", id);
  return { data: null };
};

export const deletePortfolio = async (id) => {
  const portfolios = JSON.parse(localStorage.getItem("portfolios") || "[]");
  const updated = portfolios.filter(p => p.id !== id);
  localStorage.setItem("portfolios", JSON.stringify(updated));
  console.log("MOCK DELETE: Portfolio deleted:", id);
  return { data: { success: true } };
};
