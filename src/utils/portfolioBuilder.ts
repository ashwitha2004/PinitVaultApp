export interface VaultDocument {
  id: string;
  name: string;
  type: string;
  category: 'resume' | 'academic' | 'project' | 'certification' | 'personal';
}

export interface Portfolio {
  id: number;
  template: string;
  profile: {
    name: string;
    role: string;
  };
  sections: {
    resume: VaultDocument[];
    academic: VaultDocument[];
    projects: VaultDocument[];
    certifications: VaultDocument[];
  };
  createdAt: string;
}

export const buildPortfolio = (docs: VaultDocument[], template: string): Portfolio => {
  return {
    id: Date.now(),
    template,
    profile: {
      name: "Ashwitha",
      role: "Full Stack Developer"
    },
    sections: {
      resume: docs.filter(d => d.category === "resume"),
      academic: docs.filter(d => d.category === "academic"),
      projects: docs.filter(d => d.category === "project"),
      certifications: docs.filter(d => d.category === "certification")
    },
    createdAt: new Date().toISOString()
  };
};

export const savePortfolio = (portfolio: Portfolio): void => {
  const existing = JSON.parse(localStorage.getItem("portfolios") || "[]");
  localStorage.setItem(
    "portfolios",
    JSON.stringify([portfolio, ...existing])
  );
};

export const loadPortfolios = (): Portfolio[] => {
  return JSON.parse(localStorage.getItem("portfolios") || "[]");
};

export const loadVaultDocuments = (): VaultDocument[] => {
  return JSON.parse(localStorage.getItem("vaultDocuments") || "[]");
};
