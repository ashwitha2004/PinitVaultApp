export interface UploadedFile {
  id: string;
  name: string;
  type: "pdf" | "image" | "video";
  size: number;
  createdAt: string;
  data: string;
  mimeType: string;
  portfolio?: string;
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
