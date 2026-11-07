import { ChevronDown, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

// The same navbar as yaudit.dev, so moving between the yAudit sites feels
// like one site. Every link opens in the same tab.

interface NavItem {
  label: string;
  href: string;
  // The section this site is: it links to this site's home and is shown as
  // active on every page.
  current?: boolean;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

type NavEntry = NavItem | NavGroup;

const NAV: NavEntry[] = [
  { label: "Services", href: "https://yaudit.dev/services" },
  { label: "yAgent", href: "https://yaudit.dev/yagent" },
  {
    label: "Programs",
    items: [
      { label: "Fellowships", href: "https://yaudit.dev/fellowships" },
      { label: "yBorg", href: "https://yaudit.dev/yborg" },
    ],
  },
  {
    label: "Resources",
    items: [
      { label: "Reports", href: "https://reports.yaudit.dev/" },
      { label: "Blog", href: "https://blog.yaudit.dev/" },
      { label: "Research", href: "/", current: true },
    ],
  },
  { label: "Team", href: "https://yaudit.dev/team" },
];

const CONTACT_HREF = "https://yaudit.dev/contact-us";

function isGroup(entry: NavEntry): entry is NavGroup {
  return "items" in entry;
}

const ACTIVE_ITEM = NAV.flatMap((entry) =>
  isGroup(entry) ? entry.items : [entry]
).find((item) => item.current);

function NavLink({
  item,
  className,
  onClick,
}: {
  item: NavItem;
  className: string;
  onClick?: () => void;
}) {
  return item.current ? (
    <Link href={item.href} className={className} onClick={onClick}>
      {item.label}
    </Link>
  ) : (
    <a href={item.href} className={className} onClick={onClick}>
      {item.label}
    </a>
  );
}

// A menu entry that opens a list of links. It opens on hover and on click;
// a keyboard click toggles it, and Escape or a click outside closes it.
function NavDropdown({ group }: { group: NavGroup }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listId = useId();
  const active = ACTIVE_ITEM !== undefined && group.items.includes(ACTIVE_ITEM);

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        // preventScroll: the html scroll-padding-top would otherwise scroll
        // the page to the top to bring the sticky header into view.
        buttonRef.current?.focus({ preventScroll: true });
      }
    }
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onBlur={(event) => {
        if (!rootRef.current?.contains(event.relatedTarget as Node)) {
          setOpen(false);
        }
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        // A pointer click keeps the list open after hover opened it.
        onClick={(event) => setOpen(event.detail === 0 ? !open : true)}
        className={`flex items-center gap-1 px-5 py-3 decoration-deepblue decoration-2 underline-offset-8 transition hover:text-deepblue hover:underline ${
          active || open ? "text-deepblue" : "text-zinc-400"
        }`}
      >
        {group.label}
        <ChevronDown
          aria-hidden="true"
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        // The padding lines the list up with the bottom of the header and
        // keeps the pointer inside the entry on its way down.
        <div id={listId} className="absolute left-0 top-full pt-2.5">
          <div className="min-w-[12rem] border border-zinc-950/10 bg-white py-2 shadow-lg">
            {group.items.map((item) => (
              <NavLink
                key={item.label}
                item={item}
                onClick={() => setOpen(false)}
                className={`block whitespace-nowrap px-5 py-2.5 transition hover:bg-deepblue/5 hover:text-deepblue ${
                  item === ACTIVE_ITEM ? "text-deepblue" : "text-zinc-500"
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// yaudit.dev defines its Tailwind screens as ranges (md 768-1150px, lg from
// 1150px). This site uses the default min-width screens, so "from 768px" is
// "md:" and "from 1150px" is the arbitrary "min-[1150px]:".
//
// The side margins match yaudit.dev, so the logo and Contact sit in the same
// place on every yAudit site.
function Header({
  menuOpen,
  setMenuOpen,
}: {
  menuOpen: boolean;
  setMenuOpen: (menuOpen: boolean) => void;
}) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-950/10 bg-white/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-6 min-[1150px]:px-[max(2rem,min(20vw,calc((100vw_-_1000px)/2)))]">
        <div className="flex items-center gap-3">
          <a href="https://yaudit.dev/">
            <Image
              src="/logo.svg"
              alt="yAudit"
              width={115}
              height={36}
              className="h-9 w-auto"
              preload
            />
          </a>
          {ACTIVE_ITEM && (
            <span className="hidden border-l border-zinc-300 pl-3 text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500 md:inline">
              {ACTIVE_ITEM.label}
            </span>
          )}
        </div>

        <div className="flex items-center">
          <nav className="hidden items-center text-sm font-medium min-[1150px]:flex">
            {NAV.map((entry) =>
              isGroup(entry) ? (
                <NavDropdown key={entry.label} group={entry} />
              ) : (
                <NavLink
                  key={entry.label}
                  item={entry}
                  className={`px-5 py-3 decoration-deepblue decoration-2 underline-offset-8 transition hover:text-deepblue hover:underline ${
                    entry === ACTIVE_ITEM ? "text-deepblue" : "text-zinc-400"
                  }`}
                />
              )
            )}
          </nav>

          <a
            href={CONTACT_HREF}
            className="inline-flex items-center border border-deepblue bg-deepblue px-8 py-3 text-sm font-semibold text-white transition duration-700 hover:bg-white hover:text-deepblue min-[1150px]:ml-3"
          >
            Contact
          </a>

          <button
            type="button"
            className="ml-2 px-3 py-3 text-neutral-950 min-[1150px]:hidden"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Menu />
          </button>
        </div>
      </div>
    </header>
  );
}

function MobileNavbar({
  setMenuOpen,
}: {
  setMenuOpen: (menuOpen: boolean) => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      } else if (event.key === "Tab") {
        const focusable = menuRef.current?.querySelectorAll<HTMLElement>(
          "a[href], button:not([disabled])"
        );
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      // preventScroll: the html scroll-padding-top would otherwise scroll the
      // page to the top to bring the sticky header into view.
      previousFocus?.focus({ preventScroll: true });
    };
  }, [setMenuOpen]);

  const close = () => setMenuOpen(false);
  const linkClass = (item: NavItem) =>
    `block px-6 py-4 w-full text-center text-xl hover:text-deepblue hover:bg-deepblue hover:bg-opacity-5 duration-700 ${
      item === ACTIVE_ITEM ? "text-deepblue" : "text-zinc-400"
    }`;

  return (
    <div
      ref={menuRef}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
      className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-white"
    >
      <div className="pt-8 mx-auto flex flex-col p-8 gap-2">
        <button
          ref={closeRef}
          type="button"
          aria-label="Close menu"
          onClick={close}
          className="text-deepblue"
        >
          <X size={32} />
        </button>

        {NAV.map((entry) =>
          isGroup(entry) ? (
            <div key={entry.label} role="group" aria-label={entry.label}>
              <p className="pt-4 pb-1 text-center text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                {entry.label}
              </p>
              {entry.items.map((item) => (
                <NavLink
                  key={item.label}
                  item={item}
                  onClick={close}
                  className={linkClass(item)}
                />
              ))}
            </div>
          ) : (
            <NavLink
              key={entry.label}
              item={entry}
              onClick={close}
              className={linkClass(entry)}
            />
          )
        )}

        <a
          href={CONTACT_HREF}
          onClick={close}
          className="block p-6 w-full text-center text-xl text-white bg-deepblue hover:bg-white hover:text-deepblue hover:border hover:border-deepblue duration-700"
        >
          Contact
        </a>
      </div>
    </div>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      {menuOpen && <MobileNavbar setMenuOpen={setMenuOpen} />}
    </>
  );
}
