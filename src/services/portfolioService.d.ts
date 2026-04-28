export declare const createPortfolio: (data: any) => Promise<{ data: any }>;
export declare const getAllPortfolios: () => Promise<{ data: any[] }>;
export declare const getPortfolioById: (id: string) => Promise<{ data: any }>;
export declare const updatePortfolio: (id: string, data: any) => Promise<{ data: any }>;
export declare const deletePortfolio: (id: string) => Promise<{ data: { success: boolean } }>;
