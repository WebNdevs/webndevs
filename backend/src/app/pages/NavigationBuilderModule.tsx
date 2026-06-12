import { useState, useEffect, useRef } from "react";
import {
  Button,
  Badge,
  InputField,
  SelectField,
  Tabs,
} from "@figma/astraui";
import {
  Plus,
  Trash2,
  GripVertical,
  Eye,
  Monitor,
  ChevronDown,
  Columns,
} from "lucide-react";
import { api } from "../utils/api";

type NavItem = {
  id: number;
  navigation_menu_id: number;
  parent_id: number | null;
  label: string;
  url: string | null;
  entity_type: string | null;
  entity_id: number | null;
  icon: string | null;
  badge_text: string | null;
  badge_color: string | null;
  is_featured: boolean;
  column_number: number;
  sort_order: number;
  is_active: boolean;
  opens_new_tab: boolean;
  children: NavItem[];
};

type NavMenu = {
  id: number;
  name: string;
  location: "header" | "footer" | "mobile" | "sidebar";
  is_active: boolean;
  items: NavItem[];
};

const entityTypeOptions = [
  { value: "url", label: "Custom URL" },
  { value: "tool", label: "Tool" },
  { value: "industry", label: "Industry" },
  { value: "solution", label: "Solution" },
];

type ItemForm = {
  label: string;
  url: string;
  entity_type: string;
  icon: string;
  badge_text: string;
  column_number: string;
  is_featured: boolean;
  parent_id: string;
};

const emptyItemForm: ItemForm = {
  label: "",
  url: "",
  entity_type: "url",
  icon: "",
  badge_text: "",
  column_number: "1",
  is_featured: false,
  parent_id: "",
};

function MegaMenuPreview({ items }: { items: NavItem[] }) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const hoveredItem = items.find((i) => i.id === hoveredId);

  return (
    <div className="bg-surface-bg rounded-corner-lg border border-border-primary overflow-hidden">
      <div className="bg-bg-subtle border-b border-border-primary px-xl py-md flex items-center gap-lg">
        <span className="text-video-title text-text-tertiary font-mono">WebNDevs</span>
        {items.map((item) => (
          <button
            key={item.id}
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
            className="flex items-center gap-xs text-label-sm text-text-primary hover:text-brand-primary transition-colors"
          >
            {item.label}
            {item.children.length > 0 && <ChevronDown size={12} />}
          </button>
        ))}
        <div className="ml-auto">
          <span className="bg-brand-primary text-white text-video-title px-md py-xs rounded-corner-md">Get Started</span>
        </div>
      </div>

      {hoveredItem && hoveredItem.children.length > 0 && (
        <div className="p-xl grid grid-cols-4 gap-xl">
          {[1, 2, 3, 4].map((col) => {
            const colItems = hoveredItem.children.filter((c) => c.column_number === col);
            if (colItems.length === 0) return null;
            return (
              <div key={col} className="flex flex-col gap-sm">
                {colItems.map((child) => (
                  <div key={child.id} className={`flex items-center gap-sm p-sm rounded-corner-md ${child.is_featured ? "bg-brand-primary/10" : "hover:bg-bg-faint"} transition-colors`}>
                    {child.icon && <span className="text-base">{child.icon}</span>}
                    <div className="flex-1">
                      <div className="flex items-center gap-xs">
                        <span className="text-label-sm text-text-primary">{child.label}</span>
                        {child.badge_text && (
                          <span className="bg-brand-primary/20 text-brand-primary text-video-title px-xs py-0 rounded">{child.badge_text}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {(!hoveredItem || hoveredItem.children.length === 0) && (
        <div className="p-xl text-center text-label-sm text-text-tertiary">
          Hover a menu item to preview its dropdown
        </div>
      )}
    </div>
  );
}

function NavItemRow({ item, depth = 0, onDelete, onDragStart, onDragOver, onDrop, isDragging }: {
  item: NavItem;
  depth?: number;
  onDelete: (id: number) => void;
  onDragStart?: (id: number) => void;
  onDragOver?: (e: React.DragEvent, id: number) => void;
  onDrop?: (targetId: number) => void;
  isDragging?: boolean;
}) {
  return (
    <div className={`${depth > 0 ? "ml-6 border-l-2 border-border-secondary pl-md" : ""}`}>
      <div
        className={`flex items-center gap-sm bg-surface-bg rounded-corner-md p-md border border-border-primary hover:bg-bg-faint mb-xs transition-colors ${isDragging ? "opacity-40" : ""}`}
        draggable={depth === 0}
        onDragStart={() => onDragStart?.(item.id)}
        onDragOver={(e) => { e.preventDefault(); onDragOver?.(e, item.id); }}
        onDrop={() => onDrop?.(item.id)}
      >
        {depth === 0 && (
          <GripVertical size={14} className="text-text-tertiary cursor-grab" />
        )}
        {item.icon && <span>{item.icon}</span>}
        <span className="text-label-sm text-text-primary font-semibold flex-1">{item.label}</span>
        {item.badge_text && (
          <span className="bg-brand-primary/20 text-brand-primary text-video-title px-sm py-xs rounded-corner-md">{item.badge_text}</span>
        )}
        {item.is_featured && <Badge label="Featured" variant="success" />}
        {item.url && <span className="text-video-title text-text-tertiary">{item.url}</span>}
        <span className="text-video-title text-text-tertiary">Col {item.column_number}</span>
        <Button variant="subtle" size="small" iconStart={<Trash2 size={12} />} onClick={() => onDelete(item.id)}>Delete</Button>
      </div>
      {item.children.map((child) => (
        <NavItemRow key={child.id} item={child} depth={depth + 1} onDelete={onDelete} />
      ))}
    </div>
  );
}

function ColumnArrangementEditor({
  parentItem,
  onColumnsUpdated,
}: {
  parentItem: NavItem;
  onColumnsUpdated: (updatedChildren: NavItem[]) => void;
}) {
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [dragOverCol, setDragOverCol] = useState<number | null>(null);
  const [children, setChildren] = useState<NavItem[]>(parentItem.children);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setChildren(parentItem.children);
  }, [parentItem.children]);

  const handleDragStart = (id: number) => setDraggedId(id);

  const handleDragOver = (e: React.DragEvent, col: number) => {
    e.preventDefault();
    setDragOverCol(col);
  };

  const handleDrop = async (col: number) => {
    if (!draggedId) return;
    const item = children.find((c) => c.id === draggedId);
    if (!item || item.column_number === col) {
      setDraggedId(null);
      setDragOverCol(null);
      return;
    }

    const updated = children.map((c) => c.id === draggedId ? { ...c, column_number: col } : c);
    setChildren(updated);
    setDraggedId(null);
    setDragOverCol(null);

    setIsUpdating(true);
    try {
      await api.put(`/navigation/items/${draggedId}`, { column_number: col });
      onColumnsUpdated(updated);
    } catch (err) {
      setChildren(parentItem.children);
      alert((err as Error).message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)) {
      setDragOverCol(null);
    }
  };

  return (
    <div>
      {isUpdating && (
        <p className="text-label-sm text-text-tertiary mb-sm">Saving column arrangement...</p>
      )}
      <div className="grid grid-cols-4 gap-md">
        {[1, 2, 3, 4].map((col) => {
          const colItems = children
            .filter((c) => c.column_number === col)
            .sort((a, b) => a.sort_order - b.sort_order);

          return (
            <div
              key={col}
              onDragOver={(e) => handleDragOver(e, col)}
              onDragLeave={handleDragLeave}
              onDrop={() => void handleDrop(col)}
              className={`border-2 rounded-corner-lg p-md min-h-24 transition-colors ${
                dragOverCol === col
                  ? "border-brand-primary bg-brand-primary/5"
                  : "border-border-secondary bg-bg-faint"
              }`}
            >
              <p className="text-video-title text-text-tertiary font-semibold mb-sm">Column {col}</p>
              {colItems.map((child) => (
                <div
                  key={child.id}
                  draggable
                  onDragStart={() => handleDragStart(child.id)}
                  className={`flex items-center gap-sm bg-surface-bg border border-border-primary rounded-corner-md p-sm mb-xs cursor-grab active:cursor-grabbing transition-opacity ${
                    draggedId === child.id ? "opacity-40" : ""
                  }`}
                >
                  <GripVertical size={12} className="text-text-tertiary flex-shrink-0" />
                  {child.icon && <span className="text-sm">{child.icon}</span>}
                  <span className="text-label-sm text-text-primary flex-1 truncate">{child.label}</span>
                  {child.badge_text && (
                    <span className="text-video-title text-brand-primary flex-shrink-0">{child.badge_text}</span>
                  )}
                  {child.is_featured && (
                    <span className="w-2 h-2 rounded-full bg-brand-primary flex-shrink-0" title="Featured" />
                  )}
                </div>
              ))}
              {colItems.length === 0 && (
                <div className="text-center py-lg text-video-title text-text-tertiary border border-dashed border-border-secondary rounded-corner-md">
                  Drop here
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MobilePreviewTab({ menu }: { menu: NavMenu | null }) {
  if (!menu) return null;
  return (
    <div className="flex justify-center p-2xl">
      <div className="w-80 bg-surface-bg border-2 border-border-primary rounded-corner-lg overflow-hidden shadow-lg">
        <div className="bg-bg-subtle border-b border-border-primary px-lg py-md flex items-center justify-between">
          <span className="text-label text-text-primary font-semibold">WebNDevs</span>
          <div className="flex flex-col gap-1">
            <div className="w-5 h-0.5 bg-text-primary rounded" />
            <div className="w-5 h-0.5 bg-text-primary rounded" />
            <div className="w-5 h-0.5 bg-text-primary rounded" />
          </div>
        </div>
        <div className="flex flex-col divide-y divide-border-primary">
          {menu.items.map((item) => (
            <div key={item.id}>
              <div className="px-lg py-md flex items-center justify-between">
                <div className="flex items-center gap-sm">
                  {item.icon && <span>{item.icon}</span>}
                  <span className="text-label-sm text-text-primary">{item.label}</span>
                </div>
                {item.children.length > 0 && <ChevronDown size={14} className="text-text-tertiary" />}
              </div>
              {item.children.map((child) => (
                <div key={child.id} className="px-2xl py-sm bg-bg-faint flex items-center gap-sm border-t border-border-primary">
                  {child.icon && <span className="text-sm">{child.icon}</span>}
                  <span className="text-label-sm text-text-secondary">{child.label}</span>
                  {child.badge_text && (
                    <span className="bg-brand-primary/20 text-brand-primary text-video-title px-xs rounded">{child.badge_text}</span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MenuTab({
  menu,
  onItemAdded,
  onItemDeleted,
  onMenuUpdated,
}: {
  menu: NavMenu;
  onItemAdded: (item: NavItem) => void;
  onItemDeleted: (id: number) => void;
  onMenuUpdated: (menu: NavMenu) => void;
}) {
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [itemForm, setItemForm] = useState<ItemForm>(emptyItemForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [selectedColumnParentId, setSelectedColumnParentId] = useState<number | null>(null);

  // drag-and-drop state for top-level item reordering
  const [draggedTopId, setDraggedTopId] = useState<number | null>(null);
  const dragOverTopIdRef = useRef<number | null>(null);

  const updateItemForm = (k: keyof ItemForm, v: string | boolean) => {
    setItemForm((prev) => ({ ...prev, [k]: v }));
  };

  const addItem = async () => {
    if (!itemForm.label) return;
    setIsSubmitting(true);
    setAddError(null);
    try {
      const payload = {
        navigation_menu_id: menu.id,
        label: itemForm.label,
        url: itemForm.url || undefined,
        entity_type: itemForm.entity_type !== "url" ? itemForm.entity_type : undefined,
        icon: itemForm.icon || undefined,
        badge_text: itemForm.badge_text || undefined,
        column_number: parseInt(itemForm.column_number),
        is_featured: itemForm.is_featured,
        parent_id: itemForm.parent_id ? parseInt(itemForm.parent_id) : undefined,
        sort_order: 99,
      };
      const created = await api.post<NavItem>("/navigation/items", payload);
      onItemAdded(created);
      setIsAddingItem(false);
      setItemForm(emptyItemForm);
    } catch (err) {
      setAddError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteItem = async (id: number) => {
    if (!confirm("Delete this navigation item?")) return;
    try {
      await api.del(`/navigation/items/${id}`);
      onItemDeleted(id);
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleTopLevelDrop = async (targetId: number) => {
    const sourceId = draggedTopId;
    setDraggedTopId(null);
    dragOverTopIdRef.current = null;
    if (!sourceId || sourceId === targetId) return;

    const items = [...menu.items];
    const fromIdx = items.findIndex((i) => i.id === sourceId);
    const toIdx = items.findIndex((i) => i.id === targetId);
    if (fromIdx === -1 || toIdx === -1) return;

    const reordered = [...items];
    const [moved] = reordered.splice(fromIdx, 1);
    reordered.splice(toIdx, 0, moved);
    const withOrder = reordered.map((item, idx) => ({ ...item, sort_order: idx + 1 }));

    onMenuUpdated({ ...menu, items: withOrder });

    try {
      await api.put("/navigation/items/reorder", {
        items: withOrder.map((i) => ({ id: i.id, sort_order: i.sort_order })),
      });
    } catch (err) {
      onMenuUpdated(menu);
      alert((err as Error).message);
    }
  };

  const handleColumnsUpdated = (parentId: number, updatedChildren: NavItem[]) => {
    onMenuUpdated({
      ...menu,
      items: menu.items.map((item) =>
        item.id === parentId ? { ...item, children: updatedChildren } : item
      ),
    });
  };

  const allItems = menu.items;
  const topLevelItemsWithChildren = allItems.filter((i) => i.children.length > 0);
  const selectedColumnParent = allItems.find((i) => i.id === selectedColumnParentId) ?? null;

  return (
    <div className="flex flex-col gap-xl">
      <div className="flex items-center justify-between">
        <p className="text-label text-text-primary font-semibold">{menu.name} Items</p>
        <Button variant="primary" size="small" iconStart={<Plus size={14} />} onClick={() => setIsAddingItem(true)}>Add Item</Button>
      </div>

      {allItems.map((item) => (
        <NavItemRow
          key={item.id}
          item={item}
          onDelete={deleteItem}
          onDragStart={setDraggedTopId}
          onDragOver={(e, id) => { e.preventDefault(); dragOverTopIdRef.current = id; }}
          onDrop={(targetId) => void handleTopLevelDrop(targetId)}
          isDragging={draggedTopId === item.id}
        />
      ))}

      {allItems.length === 0 && (
        <div className="bg-surface-bg rounded-corner-lg p-2xl text-center">
          <p className="text-label text-text-secondary">No items yet. Add the first menu item.</p>
        </div>
      )}

      {isAddingItem && (
        <div className="bg-bg-faint border border-border-secondary rounded-corner-lg p-lg">
          <p className="text-label text-text-primary font-semibold mb-md">Add Menu Item</p>
          {addError && (
            <div className="bg-red-50 border border-red-200 rounded-corner-md p-md mb-md">
              <p className="text-label-sm text-red-600">{addError}</p>
            </div>
          )}
          <div className="flex flex-col gap-md">
            <div className="flex gap-lg">
              <div className="flex-1">
                <InputField label="Label" placeholder="e.g. Twilio" value={itemForm.label} onChange={(v) => updateItemForm("label", v)} />
              </div>
              <div className="flex-1">
                <InputField label="URL" placeholder="/tools/twilio" value={itemForm.url} onChange={(v) => updateItemForm("url", v)} />
              </div>
            </div>
            <div className="flex gap-lg">
              <div className="flex-1">
                <SelectField label="Entity Type" options={entityTypeOptions} value={itemForm.entity_type} onChange={(v) => updateItemForm("entity_type", v)} />
              </div>
              <div className="flex-1">
                <InputField label="Icon (Emoji)" placeholder="📱" value={itemForm.icon} onChange={(v) => updateItemForm("icon", v)} />
              </div>
              <div className="flex-1">
                <InputField label="Badge Text" placeholder="New, Popular..." value={itemForm.badge_text} onChange={(v) => updateItemForm("badge_text", v)} />
              </div>
              <div className="w-24">
                <SelectField
                  label="Column"
                  options={["1", "2", "3", "4"].map((c) => ({ value: c, label: `Col ${c}` }))}
                  value={itemForm.column_number}
                  onChange={(v) => updateItemForm("column_number", v)}
                />
              </div>
            </div>
            <div className="flex gap-lg items-end">
              <div className="flex-1">
                <SelectField
                  label="Parent Item"
                  options={[
                    { value: "", label: "Top Level" },
                    ...allItems.map((i) => ({ value: i.id.toString(), label: i.label })),
                  ]}
                  value={itemForm.parent_id}
                  onChange={(v) => updateItemForm("parent_id", v)}
                />
              </div>
              <div className="flex items-center gap-sm pb-[9px]">
                <input
                  type="checkbox"
                  id={`featured-${menu.id}`}
                  checked={itemForm.is_featured}
                  onChange={(e) => updateItemForm("is_featured", e.target.checked)}
                  className="w-4 h-4 accent-brand-primary"
                />
                <label htmlFor={`featured-${menu.id}`} className="text-label-sm text-text-primary">Featured</label>
              </div>
            </div>
            <div className="flex gap-sm justify-end">
              <Button variant="neutral" onClick={() => setIsAddingItem(false)}>Cancel</Button>
              <Button variant="primary" onClick={() => void addItem()} disabled={!itemForm.label || isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Item"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Column Arrangement — shown for header menu when parent items have children */}
      {menu.location === "header" && topLevelItemsWithChildren.length > 0 && (
        <div className="bg-bg-faint border border-border-secondary rounded-corner-lg p-lg">
          <div className="flex items-center justify-between mb-md">
            <p className="text-label text-text-primary font-semibold flex items-center gap-sm">
              <Columns size={16} /> Column Arrangement
            </p>
            <p className="text-label-sm text-text-tertiary">Drag items between columns to rearrange the mega menu layout</p>
          </div>

          <div className="mb-md">
            <SelectField
              label="Parent menu item"
              options={[
                { value: "", label: "Select a menu item..." },
                ...topLevelItemsWithChildren.map((i) => ({ value: String(i.id), label: i.label })),
              ]}
              value={selectedColumnParentId !== null ? String(selectedColumnParentId) : ""}
              onChange={(v) => setSelectedColumnParentId(v ? parseInt(v) : null)}
            />
          </div>

          {selectedColumnParent && (
            <ColumnArrangementEditor
              parentItem={selectedColumnParent}
              onColumnsUpdated={(updatedChildren) => handleColumnsUpdated(selectedColumnParent.id, updatedChildren)}
            />
          )}

          {!selectedColumnParent && (
            <div className="bg-surface-bg border border-dashed border-border-secondary rounded-corner-lg p-xl text-center">
              <p className="text-label-sm text-text-tertiary">Select a parent item above to arrange its children across columns</p>
            </div>
          )}
        </div>
      )}

      {menu.location === "header" && (
        <div>
          <p className="text-label text-text-primary font-semibold mb-md flex items-center gap-sm">
            <Monitor size={16} /> Desktop Preview
          </p>
          <MegaMenuPreview items={menu.items} />
        </div>
      )}
    </div>
  );
}

export function NavigationBuilderModule() {
  const [menus, setMenus] = useState<NavMenu[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<NavMenu[]>("/navigation")
      .then((data) => { setMenus(data); setError(null); })
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  const handleItemAdded = (menuId: number, item: NavItem) => {
    setMenus((prev) => prev.map((m) => {
      if (m.id !== menuId) return m;
      if (item.parent_id) {
        const addToChildren = (items: NavItem[]): NavItem[] =>
          items.map((i) => i.id === item.parent_id
            ? { ...i, children: [...i.children, item] }
            : { ...i, children: addToChildren(i.children) }
          );
        return { ...m, items: addToChildren(m.items) };
      }
      return { ...m, items: [...m.items, item] };
    }));
  };

  const handleItemDeleted = (menuId: number, itemId: number) => {
    const removeItem = (items: NavItem[]): NavItem[] =>
      items.filter((i) => i.id !== itemId).map((i) => ({ ...i, children: removeItem(i.children) }));
    setMenus((prev) => prev.map((m) => m.id !== menuId ? m : { ...m, items: removeItem(m.items) }));
  };

  const handleMenuUpdated = (updatedMenu: NavMenu) => {
    setMenus((prev) => prev.map((m) => m.id === updatedMenu.id ? updatedMenu : m));
  };

  const headerMenu = menus.find((m) => m.location === "header") ?? null;
  const footerMenu = menus.find((m) => m.location === "footer") ?? null;

  if (isLoading) {
    return (
      <div className="p-2xl">
        <div className="bg-surface-bg rounded-corner-lg p-2xl text-center">
          <p className="text-label text-text-secondary">Loading navigation menus...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-2xl">
        <div className="bg-surface-bg rounded-corner-lg p-2xl text-center">
          <p className="text-label text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2xl flex flex-col gap-xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-title text-text-primary">Navigation Builder</h1>
          <p className="text-label-sm text-text-secondary mt-xs">
            Build and manage mega menu, footer links, and mobile navigation.
          </p>
        </div>
        <Button variant="primary" iconStart={<Eye size={16} />}>Preview Live Site</Button>
      </div>

      <div className="flex gap-xl">
        {menus.map((m) => {
          const totalItems = m.items.length + m.items.reduce((a, i) => a + i.children.length, 0);
          return (
            <div key={m.id} className="bg-surface-bg rounded-corner-lg p-xl flex-1 text-center">
              <span className="text-title text-text-primary">{totalItems}</span>
              <p className="text-video-title text-text-secondary mt-xs">{m.name} Items</p>
              <Badge label={m.is_active ? "active" : "inactive"} variant={m.is_active ? "success" : "default"} />
            </div>
          );
        })}
      </div>

      <Tabs
        tabs={[
          {
            id: "header",
            label: "Mega Menu (Header)",
            content: headerMenu ? (
              <MenuTab
                menu={headerMenu}
                onItemAdded={(item) => handleItemAdded(headerMenu.id, item)}
                onItemDeleted={(id) => handleItemDeleted(headerMenu.id, id)}
                onMenuUpdated={handleMenuUpdated}
              />
            ) : (
              <p className="text-label-sm text-text-secondary p-xl">No header menu found.</p>
            ),
          },
          {
            id: "footer",
            label: "Footer Links",
            content: footerMenu ? (
              <MenuTab
                menu={footerMenu}
                onItemAdded={(item) => handleItemAdded(footerMenu.id, item)}
                onItemDeleted={(id) => handleItemDeleted(footerMenu.id, id)}
                onMenuUpdated={handleMenuUpdated}
              />
            ) : (
              <p className="text-label-sm text-text-secondary p-xl">No footer menu found.</p>
            ),
          },
          {
            id: "mobile",
            label: "Mobile Preview",
            content: (
              <div>
                <p className="text-label-sm text-text-secondary mb-lg">Mobile menu draws from the header menu structure.</p>
                <MobilePreviewTab menu={headerMenu} />
              </div>
            ),
          },
        ]}
        defaultTab="header"
      />
    </div>
  );
}
