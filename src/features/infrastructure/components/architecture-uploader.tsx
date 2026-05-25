"use client";

import {
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { autoLayout } from "@/lib/auto-layout";
import {
  validateArchitectureGraph,
  type ValidationError,
} from "@/lib/validation";
import { useInfrastructureStore } from "@/store/infrastructure-store";

const MAX_BYTES = 1_000_000;

/** Drop zone for an uploaded architecture JSON — validates, auto-lays-out,
 *  loads into the store, and routes to /command-center on success (IV-58/59). */
export function ArchitectureUploader() {
  const router = useRouter();
  const loadGraph = useInfrastructureStore((s) => s.loadGraph);

  const [errors, setErrors] = useState<ValidationError[] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setErrors(null);
    setErrorMessage(null);

    if (file.size > MAX_BYTES) {
      setErrorMessage(
        `File is too large (${(file.size / 1024).toFixed(0)} KB). Max is ${
          MAX_BYTES / 1000
        } KB.`,
      );
      return;
    }
    let text: string;
    try {
      text = await file.text();
    } catch {
      setErrorMessage("Could not read the file.");
      return;
    }
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch (e) {
      setErrorMessage(`Invalid JSON: ${(e as Error).message}`);
      return;
    }
    const result = validateArchitectureGraph(data);
    if (!result.valid) {
      setErrors(result.errors);
      return;
    }
    const laidOut = autoLayout(result.graph.nodes);
    loadGraph({ nodes: laidOut, edges: result.graph.edges });
    router.push("/command-center");
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void handleFile(file);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void handleFile(file);
  };
  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };
  const onDragLeave = () => setDragOver(false);

  return (
    <div className="w-full space-y-5">
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={cn(
          "flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 text-center outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
          dragOver
            ? "border-primary/60 bg-primary/5"
            : "border-border bg-card/40 hover:border-primary/40",
        )}
      >
        <Upload className="size-8 text-muted-foreground" />
        <p className="mt-3 text-sm font-medium">Drop a JSON file here</p>
        <p className="mt-1 text-xs text-muted-foreground">or click to browse</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="application/json,.json"
        onChange={onChange}
        className="hidden"
      />

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Max 1 MB · `.json`</span>
        <a
          href="/sample-architecture.json"
          download
          className="text-primary hover:underline"
        >
          Download sample
        </a>
      </div>

      {errorMessage && (
        <div className="flex items-start gap-2 rounded-md border border-status-critical/40 bg-status-critical/10 p-3 text-xs text-status-critical">
          <AlertCircle className="size-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {errors && errors.length > 0 && (
        <div className="rounded-md border border-status-critical/40 bg-status-critical/10 p-3">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-status-critical">
            <AlertCircle className="size-3.5" />
            Validation errors ({errors.length})
          </p>
          <ul className="mt-2 max-h-64 space-y-1 overflow-y-auto text-xs text-muted-foreground">
            {errors.map((err, i) => (
              <li key={`${err.path}-${i}`} className="font-mono">
                <span className="text-foreground">{err.path}</span>:{" "}
                {err.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
