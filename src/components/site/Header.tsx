import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { HOTEL } from "@/lib/hotel";

const links = [
  { to: "/chambres", label: "Chambres" },
  { to: "/restaurants", label: "Restaurants" },
  { to: "/experiences", label: "Expériences" },
  { to: "/evenements", label: "Événements" },
  { to: "/galerie", label: "Galerie" },
  { to: "/contact", label: "Contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-ivory/85 backdrop-blur-xl shadow-soft py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-full gradient-ocean flex items-center justify-center text-ivory font-display text-xl">
            R
          </div>
          <div className="hidden sm:block">
            <div className={`font-display text-xl leading-none ${scrolled ? "text-navy" : "text-ivory text-shadow-hero"}`}>
              Riviera Ramatou
            </div>
            <div className={`text-[10px] tracking-[0.3em] uppercase ${scrolled ? "text-ocean" : "text-ivory/80"}`}>
              Plage • Lomé
            </div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.to}
              href={l.to}
              className={`text-sm font-medium relative group ${scrolled ? "text-navy" : "text-ivory text-shadow-hero"}`}
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-coral group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#booking"
            className="hidden md:inline-flex items-center px-5 py-2.5 rounded-full bg-coral text-ivory text-sm font-medium hover:scale-105 transition-transform shadow-soft"
          >
            Réserver
          </a>
          <button
            onClick={() => setOpen(!open)}
            className={`lg:hidden p-2 ${scrolled ? "text-navy" : "text-ivory"}`}
            aria-label="Menu"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden absolute top-full inset-x-0 bg-ivory/95 backdrop-blur-xl border-t border-border">
          <nav className="container mx-auto px-6 py-6 flex flex-col gap-4">
            {links.map((l) => (
              <a key={l.to} href={l.to} onClick={() => setOpen(false)} className="text-navy font-medium py-2 border-b border-border/50">
                {l.label}
              </a>
            ))}
            <a href="#booking" onClick={() => setOpen(false)} className="mt-2 text-center px-5 py-3 rounded-full bg-coral text-ivory">
              Réserver
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
