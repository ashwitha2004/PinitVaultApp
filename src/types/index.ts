export interface UploadedFile {
  id: string;
  name: string;
  type: "pdf" | "image" | "video";
  size: number;
  createdAt: string;
  data: string | null; // Can be null for protected files
  mimeType: string;
  portfolio?: string;
  fileObject?: File; // Store File object reference for protected files
  isProtected?: boolean; // Track if file is password-protected
}

export interface PortfolioType {
  id: string;
  name: string;
  type: "placement" | "masters" | "professional";
  documents: number;
  views: number;
  status: "active" | "shared" | "draft";
  createdAt: string;
}
