import { useRef, useState } from "react";

function bytes(n: number) {
  const u = ["B", "KB", "MB", "GB"]; let i = 0; let v = n; while (v >= 1024 && i < u.length - 1) { v /= 1024; i++; } return `${v.toFixed(1)} ${u[i]}`;
}


export default function UploadImaging() {
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const onDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    const f = Array.from(e.dataTransfer.files || []);
    if (f.length) setFiles((prev) => [...prev, ...f]);
  };

  const accept = ".dcm,.nii,.nii.gz,.zip,.jpg,.jpeg,.png";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-futuristic tracking-widest">Upload Imaging</h1>
        <p className="text-sm text-muted-foreground">Upload MRI / CT scans (DICOM, NIfTI) or images</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Upload Files Panel */}
        <div className="glass rounded-2xl p-4 card-glow">
          <h3 className="font-medium mb-2">Upload Files</h3>
          <div
            className="rounded-2xl p-8 text-center border-dashed border-2 border-white/20 hover:border-white/40 transition-colors"
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
          >
            <div className="text-sm text-muted-foreground">Drag & drop files here, or click to browse</div>
            <div className="text-xs opacity-75 mt-1">Accepted: {accept}</div>
            <input ref={inputRef} type="file" multiple accept={accept} className="hidden" onChange={(e) => setFiles((prev) => [...prev, ...Array.from(e.target.files || [])])} />
          </div>
          {files.length > 0 && (
            <div className="mt-4">
              <ul className="space-y-2 text-sm">
                {files.map((f, i) => (
                  <li key={i} className="flex items-center justify-between gap-3 dark:bg-white/5 bg-white/70 border border-black/15 dark:border-white/10 px-3 py-2 rounded-xl">
                    <div className="truncate">
                      <div className="font-medium truncate">{f.name}</div>
                      <div className="text-xs text-muted-foreground">{f.type || "unknown"} • {bytes(f.size)}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {/^image\//.test(f.type) && (
                        <img src={URL.createObjectURL(f)} alt="preview" className="h-10 w-10 object-cover rounded" />
                      )}
                      <button onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))} className="px-2 py-1 rounded-lg border border-black/15 dark:border-white/10 bg-white/80 dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10 text-xs">Remove</button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex flex-wrap gap-2">
                <button onClick={() => alert("Secure upload stubbed — connect storage to proceed")} className="px-3 py-2 rounded-xl border border-black/15 dark:border-white/10 bg-white/80 dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10">Upload Securely</button>
                <button onClick={() => window.print()} className="px-3 py-2 rounded-xl border border-black/15 dark:border-white/10 bg-white/80 dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10">Export as PDF</button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">For real uploads, we’ll integrate secure storage (e.g., S3) + optional DICOM parsing. Sharing works via Doctor/Share links.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
