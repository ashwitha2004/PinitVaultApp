import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface SelectedDocument {
  file: any;
  type: string;
}

interface DocumentContextType {
  selectedDoc: SelectedDocument | null;
  setSelectedDoc: (doc: SelectedDocument | null) => void;
  clearSelectedDoc: () => void;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export const DocumentProvider = ({ children }: { children: ReactNode }) => {
  const [selectedDoc, setSelectedDoc] = useState<SelectedDocument | null>(null);

  const clearSelectedDoc = () => {
    setSelectedDoc(null);
  };

  return (
    <DocumentContext.Provider value={{ selectedDoc, setSelectedDoc, clearSelectedDoc }}>
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocument = () => {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error('useDocument must be used within a DocumentProvider');
  }
  return context;
};
