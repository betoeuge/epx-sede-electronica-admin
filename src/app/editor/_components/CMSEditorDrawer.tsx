"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type { ContentItem } from "@/lib/content.service";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface TableConfig {
  variant: "simple" | "numerica" | "expandible";
  title?: string;
  columns: { id: string; header: string; align: "left" | "right"; type: "text" | "number" }[];
  rows: { id: string; cells: Record<string, string> }[];
}

export interface LinksConfig {
  variant: "default" | "accordion";
  sections: { id: string; title: string; collection: string }[];
}

export type Block =
  | { type: "text"; content: string }
  | { type: "image"; content: string }
  | { type: "table"; content: TableConfig }
  | { type: "links"; content: LinksConfig };

export interface ContentItemWithBlocks extends ContentItem {
  blocks: Block[];
}

export interface CMSEditorDrawerProps {
  item: ContentItemWithBlocks;
  collectionLabel: string;
  siteId: string;
  collectionId: string;
  cmsCollections: Array<{ id: string; name: string }>;
  onClose: () => void;
  onSave: (updated: ContentItemWithBlocks) => void;
  onDelete: (id: string) => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const font = "'Inter', sans-serif";

const btnMiniStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.08)",
  border: "none",
  borderRadius: "0.25rem",
  color: "#828282",
  cursor: "pointer",
  padding: "0.125rem 0.375rem",
  fontFamily: font,
  fontSize: "0.75rem",
  lineHeight: 1,
};

const btnMiniToolStyle: React.CSSProperties = {
  background: "transparent",
  border: "none",
  borderRadius: "0.25rem",
  color: "#e0e0e0",
  cursor: "pointer",
  padding: "0.25rem 0.5rem",
  fontFamily: font,
  fontSize: "0.875rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

// ─── SVG icons ────────────────────────────────────────────────────────────────

const EyeIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const TrashIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
  </svg>
);

const SaveIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </svg>
);

const GlobeSmallIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#bdbdbd" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
  </svg>
);

const TypeIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 7 4 4 20 4 20 7" />
    <line x1="9" y1="20" x2="15" y2="20" />
    <line x1="12" y1="4" x2="12" y2="20" />
  </svg>
);

const ImageBlockIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

const TableBlockIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="3" y1="15" x2="21" y2="15" />
    <line x1="9" y1="3" x2="9" y2="21" />
    <line x1="15" y1="3" x2="15" y2="21" />
  </svg>
);

const LinksBlockIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

const BoldIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
    <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
  </svg>
);

const ItalicIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="4" x2="10" y2="4" />
    <line x1="14" y1="20" x2="5" y2="20" />
    <line x1="15" y1="4" x2="9" y2="20" />
  </svg>
);

const PlusIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e0e0e0" strokeWidth="2" strokeLinecap="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

// ─── GhostButton ──────────────────────────────────────────────────────────────

function GhostButton({
  onClick,
  children,
  danger = false,
  style,
}: {
  onClick?: () => void;
  children: React.ReactNode;
  danger?: boolean;
  style?: React.CSSProperties;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.375rem",
        fontFamily: font,
        fontSize: "0.8125rem",
        fontWeight: 500,
        color: danger ? "#eb5757" : "#e0e0e0",
        background: hovered ? (danger ? "rgba(235,87,87,0.12)" : "rgba(255,255,255,0.08)") : "rgba(255,255,255,0.04)",
        border: `0.0625rem solid ${hovered ? (danger ? "rgba(235,87,87,0.4)" : "#3d3d3d") : "#2d2d2d"}`,
        borderRadius: "0.5rem",
        cursor: "pointer",
        transition: "all 0.15s",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

// ─── EditorField ──────────────────────────────────────────────────────────────

function EditorField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%" }}>
      <p style={{ fontFamily: font, fontSize: "0.875rem", fontWeight: 500, color: "#e0e0e0", margin: 0 }}>
        {label}
      </p>
      {children}
    </div>
  );
}

// ─── DarkInput ────────────────────────────────────────────────────────────────

function DarkInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        background: "#000",
        border: "0.0625rem solid #2d2d2d",
        borderRadius: "0.5rem",
        padding: "0.75rem 1rem",
        color: "#e0e0e0",
        fontFamily: font,
        fontSize: "0.875rem",
        outline: "none",
        width: "100%",
        boxSizing: "border-box",
      }}
    />
  );
}

// ─── ImageUploader ────────────────────────────────────────────────────────────

function ImageUploader({
  imageUrl,
  onUpload,
  placeholder,
}: {
  imageUrl: string;
  onUpload: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <DarkInput value={imageUrl} onChange={onUpload} placeholder={placeholder ?? "URL de la imagen..."} />
      {imageUrl && (
        <div
          style={{
            width: "100%",
            maxHeight: "12rem",
            borderRadius: "0.5rem",
            overflow: "hidden",
            background: "#000",
            border: "0.0625rem solid #2d2d2d",
          }}
        >
          <img
            src={imageUrl}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      )}
    </div>
  );
}

// ─── RichTextEditor ───────────────────────────────────────────────────────────

function RichTextEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const emitChange = () => {
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  };

  const handleCommand = (e: React.MouseEvent, command: string) => {
    e.preventDefault();
    document.execCommand(command, false);
    emitChange();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div
        style={{
          display: "flex",
          gap: "0.25rem",
          padding: "0.375rem 0.5rem",
          background: "#000",
          border: "0.0625rem solid #2d2d2d",
          borderBottom: "none",
          borderRadius: "0.375rem 0.375rem 0 0",
        }}
      >
        <button onMouseDown={(e) => handleCommand(e, "bold")} style={btnMiniToolStyle} title="Negrita">
          {BoldIcon}
        </button>
        <button onMouseDown={(e) => handleCommand(e, "italic")} style={btnMiniToolStyle} title="Cursiva">
          {ItalicIcon}
        </button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={emitChange}
        onBlur={emitChange}
        suppressContentEditableWarning
        style={{
          background: "#000",
          border: "0.0625rem solid #2d2d2d",
          borderRadius: "0 0 0.375rem 0.375rem",
          padding: "0.625rem 0.75rem",
          color: "#e0e0e0",
          fontFamily: font,
          fontSize: "0.8125rem",
          outline: "none",
          width: "100%",
          boxSizing: "border-box",
          minHeight: "6.25rem",
          lineHeight: 1.6,
          overflowY: "auto",
          whiteSpace: "pre-wrap",
        }}
      />
    </div>
  );
}

// ─── CmsTableBlockEditor ──────────────────────────────────────────────────────

const TABLE_VARIANT_LABELS: Record<string, string> = {
  simple: "Simple",
  numerica: "Numérica",
  expandible: "Expandible",
};

function CmsTableBlockEditor({
  config,
  onChange,
}: {
  config: TableConfig;
  onChange: (v: TableConfig) => void;
}) {
  const update = <K extends keyof TableConfig>(key: K, val: TableConfig[K]) =>
    onChange({ ...config, [key]: val });

  const columns = config.columns || [];
  const rows = config.rows || [];
  const variant = config.variant || "simple";

  const updateColumn = (ci: number, key: string, val: string) => {
    update(
      "columns",
      columns.map((c, i) => (i === ci ? { ...c, [key]: val } : c))
    );
  };
  const addColumn = () => {
    update("columns", [
      ...columns,
      { id: `col-${Date.now()}`, header: `Col ${columns.length + 1}`, align: "left" as const, type: "text" as const },
    ]);
  };
  const removeColumn = (ci: number) => {
    const colId = columns[ci].id;
    const updatedCols = columns.filter((_, i) => i !== ci);
    const updatedRows = rows.map((r) => {
      const cells = { ...r.cells };
      delete cells[colId];
      return { ...r, cells };
    });
    onChange({ ...config, columns: updatedCols, rows: updatedRows });
  };
  const updateRowCell = (ri: number, colId: string, val: string) => {
    update(
      "rows",
      rows.map((r, i) => (i === ri ? { ...r, cells: { ...r.cells, [colId]: val } } : r))
    );
  };
  const addRow = () => {
    const cells: Record<string, string> = {};
    columns.forEach((c) => { cells[c.id] = ""; });
    update("rows", [...rows, { id: `row-${Date.now()}`, cells }]);
  };
  const removeRow = (ri: number) => update("rows", rows.filter((_, i) => i !== ri));

  const inputStyle: React.CSSProperties = {
    background: "#000",
    border: "0.0625rem solid #2d2d2d",
    borderRadius: "0.25rem",
    padding: "0.375rem 0.5rem",
    color: "#e0e0e0",
    fontFamily: font,
    fontSize: "0.75rem",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = { fontFamily: font, fontSize: "0.6875rem", color: "#828282" };
  const tinyBtn: React.CSSProperties = {
    background: "transparent",
    border: "none",
    color: "#828282",
    cursor: "pointer",
    padding: "0.125rem",
    display: "flex",
    alignItems: "center",
    fontSize: "0.75rem",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
      {/* Variant selector */}
      <div style={{ display: "flex", gap: "0.375rem", flexWrap: "wrap" }}>
        {Object.entries(TABLE_VARIANT_LABELS).map(([key, label]) => (
          <button
            key={key}
            onClick={() => update("variant", key as TableConfig["variant"])}
            style={{
              background: variant === key ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.04)",
              border: variant === key ? "0.0625rem solid rgba(255,255,255,0.25)" : "0.0625rem solid #2d2d2d",
              borderRadius: "0.25rem",
              padding: "0.25rem 0.625rem",
              cursor: "pointer",
              fontFamily: font,
              fontSize: "0.75rem",
              color: variant === key ? "white" : "#828282",
              transition: "all 0.15s",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Columns */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.375rem" }}>
          <span style={labelStyle}>Columnas ({columns.length})</span>
          <button onClick={addColumn} style={{ ...tinyBtn, color: "#e0e0e0", gap: "0.25rem" }}>
            <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>
        {columns.map((col, ci) => (
          <div key={col.id} style={{ display: "flex", gap: "0.25rem", alignItems: "center", marginBottom: "0.25rem" }}>
            <input
              value={col.header}
              onChange={(e) => updateColumn(ci, "header", e.target.value)}
              style={{ ...inputStyle, flex: 1 }}
            />
            <button onClick={() => removeColumn(ci)} style={{ ...tinyBtn, color: "#eb5757" }}>✕</button>
          </div>
        ))}
      </div>

      {/* Rows */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.375rem" }}>
          <span style={labelStyle}>Filas ({rows.length})</span>
          <button onClick={addRow} style={{ ...tinyBtn, color: "#e0e0e0", gap: "0.25rem" }}>
            <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>
        {rows.map((row, ri) => (
          <div
            key={row.id}
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "0.0625rem solid #2d2d2d",
              borderRadius: "0.25rem",
              padding: "0.375rem",
              marginBottom: "0.375rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.25rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span
                style={{
                  fontFamily: font,
                  fontSize: "0.625rem",
                  color: "#828282",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Fila {ri + 1}
              </span>
              <button onClick={() => removeRow(ri)} style={{ ...tinyBtn, color: "#eb5757", fontSize: "0.625rem" }}>✕</button>
            </div>
            {columns.map((col) => (
              <input
                key={col.id}
                value={row.cells?.[col.id] || ""}
                onChange={(e) => updateRowCell(ri, col.id, e.target.value)}
                placeholder={col.header}
                style={inputStyle}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CmsLinksBlockEditor ──────────────────────────────────────────────────────

const LINKS_VARIANT_LABELS: Record<string, string> = { default: "Lista", accordion: "Acordeón" };

function CmsLinksBlockEditor({
  config,
  onChange,
  cmsCollections,
}: {
  config: LinksConfig;
  onChange: (v: LinksConfig) => void;
  cmsCollections: Array<{ id: string; name: string }>;
}) {
  const update = <K extends keyof LinksConfig>(key: K, val: LinksConfig[K]) =>
    onChange({ ...config, [key]: val });
  const variant = config.variant || "default";
  const sections = config.sections || [];

  const labelStyle: React.CSSProperties = { fontFamily: font, fontSize: "0.6875rem", color: "#828282" };
  const inputStyle: React.CSSProperties = {
    background: "#000",
    border: "0.0625rem solid #2d2d2d",
    borderRadius: "0.25rem",
    padding: "0.375rem 0.5rem",
    color: "#e0e0e0",
    fontFamily: font,
    fontSize: "0.75rem",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  };

  const addSection = () => {
    update("sections", [...sections, { id: `sec-${Date.now()}`, title: "Nueva Sección", collection: "" }]);
  };

  const updateSection = (idx: number, key: string, val: string) => {
    update(
      "sections",
      sections.map((s, i) => (i === idx ? { ...s, [key]: val } : s))
    );
  };

  const removeSection = (idx: number) => {
    update("sections", sections.filter((_, i) => i !== idx));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
      {/* Variant selector */}
      <div>
        <span style={{ ...labelStyle, marginBottom: "0.25rem", display: "block" }}>Visualización</span>
        <div style={{ display: "flex", gap: "0.375rem", flexWrap: "wrap" }}>
          {Object.entries(LINKS_VARIANT_LABELS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => update("variant", key as LinksConfig["variant"])}
              style={{
                background: variant === key ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.04)",
                border: variant === key ? "0.0625rem solid rgba(255,255,255,0.25)" : "0.0625rem solid #2d2d2d",
                borderRadius: "0.25rem",
                padding: "0.25rem 0.625rem",
                cursor: "pointer",
                fontFamily: font,
                fontSize: "0.75rem",
                color: variant === key ? "white" : "#828282",
                transition: "all 0.15s",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Sections list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <span style={labelStyle}>Secciones ({sections.length})</span>

        {sections.map((sec, idx) => (
          <div
            key={sec.id}
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "0.0625rem solid #2d2d2d",
              borderRadius: "0.375rem",
              padding: "0.625rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span
                style={{
                  fontFamily: font,
                  fontSize: "0.6875rem",
                  fontWeight: 500,
                  color: "#a0a0a0",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                {idx + 1}. Sección
              </span>
              <button
                onClick={() => removeSection(idx)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "0.125rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#828282",
                  transition: "color 0.15s",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#eb5757"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#828282"; }}
              >
                <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <input
              value={sec.title}
              onChange={(e) => updateSection(idx, "title", e.target.value)}
              placeholder="Título de la sección..."
              style={inputStyle}
            />
            <select
              value={sec.collection || ""}
              onChange={(e) => updateSection(idx, "collection", e.target.value)}
              style={{ ...inputStyle, appearance: "auto" }}
            >
              <option value="" style={{ background: "#1a1a1a", color: "white" }}>
                Seleccionar colección...
              </option>
              {cmsCollections.map((col) => (
                <option key={col.id} value={col.id} style={{ background: "#1a1a1a", color: "white" }}>
                  {col.name}
                </option>
              ))}
            </select>
            {sec.collection && (
              <p style={{ fontFamily: font, fontSize: "0.5625rem", color: "#6b6b6b", margin: 0 }}>
                Todos los items de "{cmsCollections.find((c) => c.id === sec.collection)?.name ?? sec.collection}" se listarán como links.
              </p>
            )}
          </div>
        ))}

        {/* Add section button */}
        <button
          onClick={addSection}
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "0.0625rem dashed #2d2d2d",
            borderRadius: "0.375rem",
            padding: "0.5rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.25rem",
            fontFamily: font,
            fontSize: "0.75rem",
            color: "#828282",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.08)";
            (e.currentTarget as HTMLButtonElement).style.color = "white";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)";
            (e.currentTarget as HTMLButtonElement).style.color = "#828282";
          }}
        >
          <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Agregar sección
        </button>
      </div>
    </div>
  );
}

// ─── BlockEditor ──────────────────────────────────────────────────────────────

function BlockEditor({
  blocks,
  onChange,
  cmsCollections,
}: {
  blocks: Block[];
  onChange: (blocks: Block[]) => void;
  cmsCollections: Array<{ id: string; name: string }>;
}) {
  const updateBlock = (idx: number, key: string, val: unknown) => {
    const updated = blocks.map((b, i) => (i === idx ? { ...b, [key]: val } : b));
    onChange(updated as Block[]);
  };
  const removeBlock = (idx: number) => onChange(blocks.filter((_, i) => i !== idx));
  const moveBlock = (idx: number, dir: -1 | 1) => {
    const arr = [...blocks];
    const target = idx + dir;
    if (target < 0 || target >= arr.length) return;
    [arr[idx], arr[target]] = [arr[target], arr[idx]];
    onChange(arr);
  };
  const addBlock = (type: Block["type"]) => {
    if (type === "table") {
      onChange([
        ...blocks,
        {
          type: "table",
          content: {
            variant: "simple",
            title: "",
            columns: [
              { id: `col-${Date.now()}-1`, header: "Nombre", align: "left", type: "text" },
              { id: `col-${Date.now()}-2`, header: "ID", align: "right", type: "number" },
              { id: `col-${Date.now()}-3`, header: "Descripción", align: "left", type: "text" },
            ],
            rows: [{ id: `row-${Date.now()}-1`, cells: {} }],
          },
        },
      ]);
    } else if (type === "links") {
      onChange([...blocks, { type: "links", content: { variant: "default", sections: [] } }]);
    } else {
      onChange([...blocks, { type, content: "" } as Block]);
    }
  };

  const toolbarBtnStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.05)",
    borderRadius: "0.5rem",
    padding: "0.5rem 1rem",
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
    cursor: "pointer",
    border: "none",
    transition: "background 0.15s",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {/* Toolbar */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {(["text", "image", "table", "links"] as Block["type"][]).map((type) => (
          <button
            key={type}
            onClick={() => addBlock(type)}
            style={toolbarBtnStyle}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.1)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)"; }}
          >
            {PlusIcon}
            <span style={{ fontFamily: font, fontSize: "0.8125rem", color: "#e0e0e0" }}>
              {type === "text" ? "Texto" : type === "image" ? "Imagen" : type === "table" ? "Tabla" : "Links"}
            </span>
          </button>
        ))}
      </div>

      {/* Block list */}
      {blocks.map((block, idx) => (
        <div
          key={idx}
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "0.0625rem solid #2d2d2d",
            borderRadius: "0.5rem",
            padding: "0.75rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          {/* Block header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.375rem",
                fontFamily: font,
                fontSize: "0.75rem",
                fontWeight: 500,
                color: "#828282",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {block.type === "image"
                ? ImageBlockIcon
                : block.type === "table"
                ? TableBlockIcon
                : block.type === "links"
                ? LinksBlockIcon
                : TypeIcon}
              {block.type === "image"
                ? " Imagen"
                : block.type === "table"
                ? " Tabla"
                : block.type === "links"
                ? " Links"
                : " Texto"}
            </span>
            <div style={{ display: "flex", gap: "0.25rem" }}>
              <button onClick={() => moveBlock(idx, -1)} disabled={idx === 0} style={btnMiniStyle}>
                ↑
              </button>
              <button onClick={() => moveBlock(idx, 1)} disabled={idx === blocks.length - 1} style={btnMiniStyle}>
                ↓
              </button>
              <button onClick={() => removeBlock(idx)} style={{ ...btnMiniStyle, color: "#eb5757" }}>
                ✕
              </button>
            </div>
          </div>

          {/* Block content */}
          {block.type === "text" ? (
            <RichTextEditor
              value={block.content as string}
              onChange={(val) => updateBlock(idx, "content", val)}
            />
          ) : block.type === "table" ? (
            <CmsTableBlockEditor
              config={block.content as TableConfig}
              onChange={(val) => updateBlock(idx, "content", val)}
            />
          ) : block.type === "links" ? (
            <CmsLinksBlockEditor
              config={block.content as LinksConfig}
              onChange={(val) => updateBlock(idx, "content", val)}
              cmsCollections={cmsCollections}
            />
          ) : (
            <ImageUploader
              imageUrl={block.content as string}
              onUpload={(val) => updateBlock(idx, "content", val)}
              placeholder="URL de la imagen del bloque..."
            />
          )}
        </div>
      ))}

      {blocks.length === 0 && (
        <div style={{ textAlign: "center", padding: "1rem 0" }}>
          <p style={{ fontFamily: font, fontSize: "0.8125rem", color: "#4f4f4f", margin: 0 }}>
            Sin bloques de contenido. Usa los botones de arriba para agregar.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Main CMSEditorDrawer ─────────────────────────────────────────────────────

export function CMSEditorDrawer({
  item,
  collectionLabel,
  cmsCollections,
  onClose,
  onSave,
  onDelete,
}: CMSEditorDrawerProps) {
  const [draft, setDraft] = useState<ContentItemWithBlocks>({
    ...item,
    blocks: item.blocks ? [...item.blocks] : [],
  });
  const update = <K extends keyof ContentItemWithBlocks>(key: K, val: ContentItemWithBlocks[K]) =>
    setDraft((prev) => ({ ...prev, [key]: val }));

  // ── Resizable width ──────────────────────────────────────────────────────
  const [drawerWidth, setDrawerWidth] = useState(710);
  const [resizing, setResizing] = useState(false);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const newWidth = window.innerWidth - e.clientX;
    setDrawerWidth(Math.max(420, Math.min(newWidth, window.innerWidth * 0.8)));
  }, []);

  const handleMouseUp = useCallback(() => setResizing(false), []);

  useEffect(() => {
    if (!resizing) return;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [resizing, handleMouseMove, handleMouseUp]);

  const handleSave = () => {
    onSave({ ...draft });
    onClose();
  };

  const handleDelete = () => {
    onDelete(draft.id);
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "3.1875rem",
        right: 0,
        bottom: 0,
        width: drawerWidth,
        display: "flex",
        flexDirection: "column",
        background: "#181818",
        boxShadow: "-5px 0 16px rgba(0,0,0,0.3)",
        zIndex: 200,
        overflow: "hidden",
      }}
    >
      {/* Resize handle */}
      <div
        onMouseDown={() => setResizing(true)}
        style={{
          position: "absolute",
          left: -3,
          top: 0,
          bottom: 0,
          width: 6,
          cursor: "col-resize",
          zIndex: 10,
          background: resizing ? "#2F80ED" : "transparent",
          transition: resizing ? "none" : "background 0.2s",
        }}
        onMouseEnter={(e) => {
          if (!resizing) (e.currentTarget as HTMLDivElement).style.background = "#2F80ED";
        }}
        onMouseLeave={(e) => {
          if (!resizing) (e.currentTarget as HTMLDivElement).style.background = "transparent";
        }}
      />

      {/* ── Top Bar ── */}
      <div
        style={{
          background: "#181818",
          borderBottom: "0.0625rem solid #2d2d2d",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.5rem 1rem",
          flexShrink: 0,
        }}
      >
        {/* Close button */}
        <div
          onClick={onClose}
          style={{
            width: "2rem",
            height: "2rem",
            borderRadius: "0.25rem",
            background: "rgba(255,255,255,0.08)",
            border: "0.0625rem solid #2d2d2d",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.25)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.08)"; }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <GhostButton style={{ padding: "0.5rem 1rem" }}>
            {EyeIcon}
            Visualizar
          </GhostButton>
          <GhostButton danger style={{ padding: "0.5rem 1rem" }} onClick={handleDelete}>
            {TrashIcon}
            Eliminar
          </GhostButton>
          <GhostButton style={{ padding: "0.5rem 1rem" }} onClick={handleSave}>
            {SaveIcon}
            Guardar
          </GhostButton>
        </div>
      </div>

      {/* ── Form Body ── */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          background: "#181818",
          padding: "1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
        }}
      >
        <EditorField label="Titulo">
          <DarkInput value={draft.title ?? ""} onChange={(v) => update("title", v)} />
        </EditorField>

        <EditorField label="Slug">
          <DarkInput value={draft.slug ?? ""} onChange={(v) => update("slug", v)} />
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.25rem" }}>
            {GlobeSmallIcon}
            <span style={{ fontFamily: font, fontSize: "0.875rem", color: "#bdbdbd" }}>
              tusitio.url/{collectionLabel.toLowerCase()}/{draft.slug}
            </span>
          </div>
        </EditorField>

        <EditorField label="Tag">
          <DarkInput value={draft.tag ?? ""} onChange={(v) => update("tag", v)} />
        </EditorField>

        <EditorField label="Imagen Principal">
          <ImageUploader
            imageUrl={draft.thumbnailUrl ?? ""}
            onUpload={(v) => update("thumbnailUrl", v)}
            placeholder="URL de la imagen principal..."
          />
        </EditorField>

        <EditorField label="Fecha">
          <DarkInput value={draft.date ?? ""} onChange={(v) => update("date", v)} placeholder="DD / MM / AA" />
        </EditorField>

        <EditorField label="Descripción">
          <DarkInput value={draft.description ?? ""} onChange={(v) => update("description", v)} placeholder="Descripción breve..." />
        </EditorField>

        {/* Block-based Content Editor */}
        <EditorField label="Contenido">
          <BlockEditor
            blocks={draft.blocks || []}
            onChange={(b) => update("blocks", b)}
            cmsCollections={cmsCollections}
          />
        </EditorField>
      </div>
    </div>
  );
}
