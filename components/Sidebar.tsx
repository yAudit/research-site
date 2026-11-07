import { useState } from "react";
import Link from "next/link";
import { ChevronRight, ChevronDown } from "lucide-react";
import categoriesData from "../lib/categories.json";

interface SidebarProps {
  category: string;
  currentSlug: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ category, currentSlug, isOpen = false, onClose }: SidebarProps) {
  const categoryData = categoriesData.categories[category as keyof typeof categoriesData.categories];
  
  // Get all slugs that have subpages to expand by default
  const getDefaultExpandedItems = (): string[] => {
    if (!categoryData) return [];
    
    let structure: Record<string, any> = {};
    if (category === 'proxies') {
      structure = (categoryData as any).structure || {};
    } else if (category === 'mpc') {
      structure = (categoryData as any).seo?.structure || {};
    }

    return Object.entries(structure)
      .filter(([_, item]) => typeof item === 'object' && item.subpages)
      .map(([slug, _]) => slug);
  };

  const [expandedItems, setExpandedItems] = useState<string[]>(getDefaultExpandedItems);
  
  if (!categoryData) {
    return null;
  }
  
  // Get structure based on category
  let structure: Record<string, any> = {};
  if (category === 'proxies') {
    structure = (categoryData as any).structure || {};
  } else if (category === 'mpc') {
    structure = (categoryData as any).seo?.structure || {};
  }

  const toggleExpanded = (slug: string) => {
    setExpandedItems(prev => 
      prev.includes(slug) 
        ? prev.filter(item => item !== slug)
        : [...prev, slug]
    );
  };

  const renderSidebarItem = (slug: string, item: string | { title: string; subpages?: Record<string, string> }) => {
    const activeClass = 'bg-deepblue/20 text-deepblue font-bold';
    const inactiveClass = 'font-medium hover:text-title';
    const isActive = currentSlug === slug;

    if (typeof item === 'string') {
      return <Link key={slug} href={`/${slug}`} onClick={onClose} className={`block px-4 py-3 text-sm transition-colors ${isActive ? activeClass : `text-zinc-700 ${inactiveClass}`}`}>{item}</Link>;
    }

    const isExpanded = expandedItems.includes(slug);
    const hasSubpages = item.subpages && Object.keys(item.subpages).length > 0;

    return (
      <div key={slug}>
        <div className="flex items-center">
          <Link href={`/${slug}`} onClick={onClose} className={`flex-1 block px-4 py-3 text-sm transition-colors ${isActive ? activeClass : `text-zinc-700 ${inactiveClass}`}`}>{item.title}</Link>
          {hasSubpages && <button onClick={() => toggleExpanded(slug)} className="p-1 text-body hover:text-title">{isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}</button>}
        </div>
        {hasSubpages && isExpanded && (
          <div className="ml-4 mt-2 space-y-1">
            {Object.entries(item.subpages!).map(([subSlug, subTitle]) => (
              <Link key={subSlug} href={`/${subSlug}`} onClick={onClose} className={`block px-4 py-3 text-sm transition-colors ${currentSlug === subSlug ? activeClass : `text-zinc-500 ${inactiveClass}`}`}>{subTitle}</Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  // On mobile the sidebar is a drawer below the sticky navbar (65px). On
  // desktop it stays in the flow, under the navbar when the page scrolls.
  return (
    <div
      className={`
        w-60 bg-gray-50 p-3
        md:relative md:top-0 md:z-auto md:translate-x-0
        fixed left-0 top-[65px] z-40
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}
      style={{ height: 'calc(100vh - 65px)' }}
    >
      <div className="mb-6 overflow-y-auto" style={{ height: 'calc(100% - 80px)' }}>
          {Object.entries(structure).map(([slug, item]) =>
            renderSidebarItem(slug, item)
          )}
        <Link href="/" onClick={onClose}>
        <h2 className="my-10 text-md px-4 text-deepblue font-bold">←  Back to Research</h2>
      </Link>
      </div>

    </div>
  );
}