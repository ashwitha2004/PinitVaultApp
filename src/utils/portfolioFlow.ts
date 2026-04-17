export const PORTFOLIOS_STORAGE_KEY = "portfolios";
export const PORTFOLIO_FLOW_DRAFT_KEY = "portfolioCreationDraft";

export type PortfolioTypeOption = "Placement" | "Masters" | "Professional";

export interface PortfolioItem {
  id: string;
  title: string;
  type: PortfolioTypeOption;
  time: string;
  docs: number;
  views: number;
  status: "Active" | "Shared" | "Draft";
  createdAt: string;
  selectedDocumentIds?: string[];
  template?: string;
  includeTableOfContents?: boolean;
}

export interface PortfolioFlowDraft {
  portfolio: PortfolioItem;
  selectedDocumentIds: string[];
  selectedTemplate: "Clean Professional" | "Card-based Modern" | "Minimal Resume" | null;
  includeTableOfContents: boolean;
}

export interface VaultFileRecord {
  id: string;
  name: string;
  type: string;
  size: number;
  data: string;
  uploadedAt: string;
}

export const readJsonArray = <T>(key: string): T[] => {
  try {
    const raw = localStorage.getItem(key) || "[]";
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const readFlowDraft = (): PortfolioFlowDraft | null => {
  try {
    const raw = localStorage.getItem(PORTFOLIO_FLOW_DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || !parsed.portfolio) return null;
    return parsed as PortfolioFlowDraft;
  } catch {
    return null;
  }
};

export const writeFlowDraft = (draft: PortfolioFlowDraft) => {
  localStorage.setItem(PORTFOLIO_FLOW_DRAFT_KEY, JSON.stringify(draft));
};
