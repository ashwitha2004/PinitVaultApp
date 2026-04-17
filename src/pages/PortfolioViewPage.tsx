import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, X } from "lucide-react";
import { PORTFOLIOS_STORAGE_KEY, type PortfolioItem, type VaultFileRecord, readJsonArray } from "../utils/portfolioFlow";

const PortfolioViewPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [previewDoc, setPreviewDoc] = useState<VaultFileRecord | null>(null);

  const portfolios = readJsonArray<PortfolioItem>(PORTFOLIOS_STORAGE_KEY);
  const portfolio = portfolios.find((item) => item.id === id);
  const vaultFiles = readJsonArray<VaultFileRecord>("vaultFiles");

  const selectedDocs = useMemo(() => {
    if (!portfolio) return [];
    const selectedIds = Array.isArray(portfolio.selectedDocumentIds) ? portfolio.selectedDocumentIds : [];
    return vaultFiles.filter((doc) => selectedIds.includes(doc.id));
  }, [portfolio, vaultFiles]);

  const templateMode = useMemo(() => {
    const rawTemplate = (portfolio?.template || "").toLowerCase();
    if (rawTemplate.includes("card")) return "card";
    return "clean";
  }, [portfolio?.template]);

  return (
    <div className="relative h-full min-h-0 overflow-hidden bg-gradient-to-b from-[#0b1220] via-[#111827] to-[#030712] text-white -mx-4 -mt-4 flex flex-col">
      <div className="px-4 pt-5 pb-4 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/portfolio")} className="p-2 rounded-lg bg-white/10">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-lg font-semibold">{portfolio?.title || "Portfolio View"}</h1>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4">
        {!portfolio ? (
          <div className="rounded-2xl border border-white/10 bg-white/10 p-6 text-center text-white/80">
            Portfolio not found.
          </div>
        ) : selectedDocs.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/10 p-6 text-center text-white/80">
            No documents available in this portfolio.
          </div>
        ) : templateMode === "card" ? (
          <div className="grid grid-cols-2 gap-3">
            {selectedDocs.map((doc) => (
              <button
                key={doc.id}
                onClick={() => setPreviewDoc(doc)}
                className="rounded-2xl border border-white/10 bg-white/10 p-3 text-left"
              >
                <div className="h-24 rounded-lg overflow-hidden border border-white/10 flex items-center justify-center bg-black/20 mb-2">
                  {doc.type.includes("image") ? (
                    <img src={doc.data} alt={doc.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-white/70 uppercase">PDF</span>
                  )}
                </div>
                <p className="text-sm font-medium truncate">{doc.name}</p>
                <p className="text-xs text-white/60">
                  {doc.type.includes("image") ? "Image" : "PDF"} · {new Date(doc.uploadedAt).toLocaleDateString()}
                </p>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {selectedDocs.map((doc) => (
              <button
                key={doc.id}
                onClick={() => setPreviewDoc(doc)}
                className="w-full rounded-xl bg-white/10 border border-white/10 p-3 text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg overflow-hidden border border-white/10 flex items-center justify-center bg-black/20">
                    {doc.type.includes("image") ? (
                      <img src={doc.data} alt={doc.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs text-white/70 uppercase">PDF</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{doc.name}</p>
                    <p className="text-xs text-white/60">
                      {doc.type.includes("image") ? "Image" : "PDF"} · {new Date(doc.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {previewDoc && (
        <div className="absolute inset-0 z-20 bg-black/70 flex items-center justify-center p-4">
          <div className="w-full rounded-2xl border border-white/20 bg-[#0b1220] p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold truncate">{previewDoc.name}</p>
              <button onClick={() => setPreviewDoc(null)} className="p-1 rounded bg-white/10">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="h-64 rounded-xl overflow-hidden border border-white/10 bg-black/20 flex items-center justify-center">
              {previewDoc.type.includes("image") ? (
                <img src={previewDoc.data} alt={previewDoc.name} className="w-full h-full object-contain" />
              ) : (
                <iframe src={previewDoc.data} title={previewDoc.name} className="w-full h-full border-0" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioViewPage;
