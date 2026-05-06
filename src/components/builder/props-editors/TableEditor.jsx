import React, { useState } from 'react';
import { Accordion } from '../Accordion';
import { AddButton, ControlGroup, EmptyText, InlineBadge, TextInput, Selector, ToggleSwitch, TitleBlock } from '../EditorControls';

// ─── Design tokens (matches sidebar system) ───────────────────
const font = "'Inter', sans-serif";

const TABLE_VARIANTS = {
  'simple':     { name: 'Simple' },
  'numerica':   { name: 'Numérica' },
  'expandible': { name: 'Expandible' },
};

const ALIGN_OPTIONS = {
  'left':  { name: 'Izquierda' },
  'right': { name: 'Derecha' },
};

const COL_TYPE_OPTIONS = {
  'text':   { name: 'Texto' },
  'number': { name: 'Número' },
};

let _colIdCounter = 100;
let _rowIdCounter = 100;
const nextColId = () => `col-${Date.now()}-${_colIdCounter++}`;
const nextRowId = () => `row-${Date.now()}-${_rowIdCounter++}`;

// ─── Reusable icon button ─────────────────────────────────────
function IconBtn({ onClick, title, danger = false, children }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      title={title}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'transparent', border: 'none', cursor: 'pointer',
        padding: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: hovered
          ? (danger ? '#ef4444' : 'var(--text-active)')
          : 'var(--text-dim)',
        transition: 'color 0.15s',
        borderRadius: '0.25rem',
      }}
    >
      {children}
    </button>
  );
}

// ─── Column card ─────────────────────────────────────────────
function ColumnCard({ col, colIndex, variant, onUpdate, onRemove }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{
      background: 'var(--bg-darker)',
      border: '0.0625rem solid var(--border-subtle)',
      borderRadius: '0.5rem',
      overflow: 'hidden',
    }}>
      {/* Header row */}
      <div
        onClick={() => setExpanded(v => !v)}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.5rem 0.75rem',
          cursor: 'pointer',
        }}
      >
        {/* Drag dots */}
        <svg width={7} height={14} viewBox="0 0 7 14" fill="none" style={{ flexShrink: 0, opacity: 0.4 }}>
          <circle cx="2" cy="2"  r="1.3" fill="currentColor"/>
          <circle cx="2" cy="7"  r="1.3" fill="currentColor"/>
          <circle cx="2" cy="12" r="1.3" fill="currentColor"/>
          <circle cx="6" cy="2"  r="1.3" fill="currentColor"/>
          <circle cx="6" cy="7"  r="1.3" fill="currentColor"/>
          <circle cx="6" cy="12" r="1.3" fill="currentColor"/>
        </svg>

        {/* Column name preview */}
        <span style={{
          fontFamily: font, fontSize: '0.8125rem', fontWeight: 500,
          color: 'var(--text-active)', flex: 1,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {col.header || `Columna ${colIndex + 1}`}
        </span>

        {/* Align badge */}
        <InlineBadge style={{ fontWeight: 500 }}>
          {col.align === 'right' ? '→' : '←'}
        </InlineBadge>

        {/* Expand chevron */}
        <svg
          width={10} height={10} viewBox="0 0 24 24" fill="none"
          stroke="var(--text-dim)" strokeWidth="2.5" strokeLinecap="round"
          style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s', flexShrink: 0 }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>

        {/* Delete (stop propagation so it doesn't toggle accordion) */}
        <div onClick={e => { e.stopPropagation(); onRemove(); }}>
          <IconBtn danger title="Eliminar columna">
            <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </IconBtn>
        </div>
      </div>

      {/* Expanded fields */}
      {expanded && (
        <div style={{
          borderTop: '0.0625rem solid var(--border-subtle)',
          padding: '0.75rem',
          display: 'flex', flexDirection: 'column', gap: '0.625rem',
          background: 'var(--bg-main)',
        }}>
          <TextInput
            value={col.header}
            onChange={v => onUpdate('header', v)}
            placeholder="Nombre de columna"
          />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <div style={{ flex: 1 }}>
              <span style={{ fontFamily: font, fontSize: '0.6875rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.25rem' }}>
                Alineación
              </span>
              <Selector
                value={col.align || 'left'}
                options={['left', 'right']}
                displayMap={ALIGN_OPTIONS}
                onChange={v => onUpdate('align', v)}
              />
            </div>
            {variant === 'numerica' && (
              <div style={{ flex: 1 }}>
                <span style={{ fontFamily: font, fontSize: '0.6875rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.25rem' }}>
                  Tipo
                </span>
                <Selector
                  value={col.type || 'text'}
                  options={['text', 'number']}
                  displayMap={COL_TYPE_OPTIONS}
                  onChange={v => onUpdate('type', v)}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Row card ────────────────────────────────────────────────
function RowCard({ row, rowIndex, columns, variant, onUpdateCell, onUpdateExpandable, onRemove }) {
  const [expanded, setExpanded] = useState(false);
  const firstCellValue = columns[0] ? (row.cells?.[columns[0].id] || '') : '';
  const preview = firstCellValue || `Fila ${rowIndex + 1}`;

  return (
    <div style={{
      background: 'var(--bg-darker)',
      border: '0.0625rem solid var(--border-subtle)',
      borderRadius: '0.5rem',
      overflow: 'hidden',
    }}>
      {/* Header row */}
      <div
        onClick={() => setExpanded(v => !v)}
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', cursor: 'pointer' }}
      >
        {/* Row number badge */}
        <span style={{
          fontFamily: font, fontSize: '0.625rem', fontWeight: 500,
          color: 'var(--text-dim)',
          background: 'var(--bg-hover, rgba(255,255,255,0.06))',
          padding: '0.1rem 0.4rem', borderRadius: '0.25rem',
          minWidth: '1.5rem', textAlign: 'center', flexShrink: 0,
        }}>
          {rowIndex + 1}
        </span>

        {/* First cell preview */}
        <span style={{
          fontFamily: font, fontSize: '0.8125rem',
          color: firstCellValue ? 'var(--text-active)' : 'var(--text-dim)',
          flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          fontStyle: firstCellValue ? 'normal' : 'italic',
        }}>
          {preview}
        </span>

        {/* Cell count badge */}
        <span style={{
          fontFamily: font, fontSize: '0.625rem', color: 'var(--text-dim)',
          background: 'var(--bg-hover, rgba(255,255,255,0.06))',
          padding: '0.125rem 0.375rem', borderRadius: '0.25rem',
        }}>
          {columns.length} celdas
        </span>

        {/* Chevron */}
        <svg
          width={10} height={10} viewBox="0 0 24 24" fill="none"
          stroke="var(--text-dim)" strokeWidth="2.5" strokeLinecap="round"
          style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s', flexShrink: 0 }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>

        {/* Delete */}
        <div onClick={e => { e.stopPropagation(); onRemove(); }}>
          <IconBtn danger title="Eliminar fila">
            <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </IconBtn>
        </div>
      </div>

      {/* Expanded cell fields */}
      {expanded && (
        <div style={{
          borderTop: '0.0625rem solid var(--border-subtle)',
          padding: '0.75rem',
          display: 'flex', flexDirection: 'column', gap: '0.5rem',
          background: 'var(--bg-main)',
        }}>
          {columns.length === 0 && (
            <EmptyText>
              Agrega columnas primero para editar celdas.
            </EmptyText>
          )}
          {columns.map(col => (
            <div key={col.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <span style={{ fontFamily: font, fontSize: '0.6875rem', color: 'var(--text-dim)' }}>
                {col.header}
              </span>
              <TextInput
                value={row.cells?.[col.id] || ''}
                onChange={v => onUpdateCell(col.id, v)}
                placeholder={`Valor de ${col.header}...`}
              />
            </div>
          ))}

          {/* Expandable variant extra fields */}
          {variant === 'expandible' && row.expandable && (
            <div style={{
              borderTop: '0.0625rem solid var(--border-subtle)',
              paddingTop: '0.625rem', marginTop: '0.25rem',
              display: 'flex', flexDirection: 'column', gap: '0.5rem',
            }}>
              <span style={{
                fontFamily: font, fontSize: '0.6875rem', fontWeight: 500,
                color: 'var(--brand-primary, #3b82f6)',
                textTransform: 'uppercase', letterSpacing: '0.05em',
              }}>
                Contenido expandible
              </span>
              <TextInput
                value={row.expandable.subtitle || ''}
                onChange={v => onUpdateExpandable('subtitle', v)}
                placeholder="Subtítulo..."
              />
              <TextInput
                value={row.expandable.description || ''}
                onChange={v => onUpdateExpandable('description', v)}
                placeholder="Descripción..."
                isTextArea
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────
export function TableEditor({ config, onChange }) {
  const [openPanels, setOpenPanels] = useState({ config: true, columns: true, rows: false });
  const togglePanel = (key) => setOpenPanels(p => ({ ...p, [key]: !p[key] }));

  const update = (key, value) => onChange({ ...config, [key]: value });

  const variant    = config.variant     ?? 'simple';
  const title      = config.title       ?? '';
  const showTotals   = config.showTotals   ?? false;
  const columns    = config.columns     ?? [];
  const rows       = config.rows        ?? [];

  // ── Column CRUD ──
  const updateColumn = (ci, key, val) => {
    update('columns', columns.map((c, i) => i === ci ? { ...c, [key]: val } : c));
  };
  const addColumn = () => {
    update('columns', [...columns, {
      id: nextColId(), header: `Columna ${columns.length + 1}`,
      align: 'left', type: 'text', sortable: false, width: '',
    }]);
  };
  const removeColumn = (ci) => {
    const colId = columns[ci].id;
    const updatedCols = columns.filter((_, i) => i !== ci);
    const updatedRows = rows.map(r => { const c = { ...r.cells }; delete c[colId]; return { ...r, cells: c }; });
    onChange({ ...config, columns: updatedCols, rows: updatedRows });
  };

  // ── Row CRUD ──
  const updateRowCell = (ri, colId, val) => {
    update('rows', rows.map((r, i) => i === ri ? { ...r, cells: { ...r.cells, [colId]: val } } : r));
  };
  const updateExpandable = (ri, key, val) => {
    update('rows', rows.map((r, i) =>
      i === ri ? { ...r, expandable: { ...r.expandable, [key]: val } } : r
    ));
  };
  const addRow = () => {
    const cells = {};
    columns.forEach(c => { cells[c.id] = ''; });
    const newRow = { id: nextRowId(), cells };
    if (variant === 'expandible') newRow.expandable = { subtitle: '', description: '', subRows: [] };
    update('rows', [...rows, newRow]);
  };
  const removeRow = (ri) => update('rows', rows.filter((_, i) => i !== ri));

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>

      <Accordion title="Contenido y diseño" isOpen={openPanels.config} onToggle={() => togglePanel('config')}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <TitleBlock
            title={title}
            subtitle={config.subtitle || ''}
            titleAlign={config.titleAlign || 'left'}
            onChange={(key, val) => update(key, val)}
          />

          <ControlGroup title="Tipo de tabla">
            <Selector
              value={variant}
              options={Object.keys(TABLE_VARIANTS)}
              displayMap={TABLE_VARIANTS}
              onChange={v => update('variant', v)}
            />
          </ControlGroup>

          {variant === 'numerica' && (
            <ControlGroup title="Mostrar fila de totales">
              <ToggleSwitch checked={showTotals} onChange={v => update('showTotals', v)} />
            </ControlGroup>
          )}
        </div>
      </Accordion>

      {/* ─── Columnas ─── */}
      <Accordion title={`Columnas (${columns.length})`} isOpen={openPanels.columns} onToggle={() => togglePanel('columns')}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {columns.length === 0 && (
            <EmptyText>
              Sin columnas. Agrega una para empezar.
            </EmptyText>
          )}
          {columns.map((col, ci) => (
            <ColumnCard
              key={col.id}
              col={col}
              colIndex={ci}
              variant={variant}
              onUpdate={(key, val) => updateColumn(ci, key, val)}
              onRemove={() => removeColumn(ci)}
            />
          ))}
          <AddButton onClick={addColumn} label="Agregar columna" />
        </div>
      </Accordion>

      {/* ─── Filas ─── */}
      <Accordion title={`Filas (${rows.length})`} isOpen={openPanels.rows} onToggle={() => togglePanel('rows')}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {rows.length === 0 && (
            <EmptyText>
              Sin filas. Agrega una para empezar.
            </EmptyText>
          )}
          {rows.map((row, ri) => (
            <RowCard
              key={row.id}
              row={row}
              rowIndex={ri}
              columns={columns}
              variant={variant}
              onUpdateCell={(colId, val) => updateRowCell(ri, colId, val)}
              onUpdateExpandable={(key, val) => updateExpandable(ri, key, val)}
              onRemove={() => removeRow(ri)}
            />
          ))}
          <AddButton onClick={addRow} label="Agregar fila" />
        </div>
      </Accordion>

    </div>
  );
}
