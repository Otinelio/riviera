import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Waves } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { to: "/", label: "Accueil" },
  { to: "/chambres", label: "Chambres & Suites" },
  { to: "/restaurants", label: "Restaurants" },
  { to: "/experiences", label: "Expériences" },
  { to: "/evenements", label: "Événements" },
  { to: "/#visite-360", hash: "visite-360", label: "Visite 360°" },
  { to: "/galerie", label: "Galerie" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar({ transparentOverHero = true }: { transparentOverHero?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isTransparent = transparentOverHero && !scrolled;
  const textColor = isTransparent ? "text-ivory" : "text-navy";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        isTransparent ? "bg-transparent py-5" : "bg-ivory/85 backdrop-blur-md shadow-soft py-3"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-full bg-ocean text-ivory flex items-center justify-center">
            <Waves size={20} />
          </div>
          <div className="hidden sm:block">
            <div className={`font-display text-xl leading-none ${textColor}`}>Riviera Ramatou Plage</div>
            <div className={`text-[10px] tracking-[0.3em] uppercase ${isTransparent ? "text-ivory/80" : "text-ocean"}`}>
              Lomé • Togo
            </div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {links.map((l) => {
            const active = pathname === l.to;
            if ("hash" in l && l.hash) {
              return (
                <a
                  key={l.label}
                  href={`/#${l.hash}`}
                  onClick={(e) => {
                    if (pathname === "/") {
                      e.preventDefault();
                      document.getElementById(l.hash)?.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className={`text-sm font-medium relative ${textColor}`}
                >
                  {l.label}
                  <span
                    className="absolute -bottom-1.5 left-0 h-px bg-coral transition-all duration-300 w-0 group-hover:w-full"
                  />
                </a>
              );
            }
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`text-sm font-medium relative ${textColor}`}
              >
                {l.label}
                <span
                  className={`absolute -bottom-1.5 left-0 h-px bg-coral transition-all duration-300 ${
                    active ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                  style={active ? { width: "100%" } : undefined}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/contact"
            className="hidden md:inline-flex items-center px-5 py-2.5 rounded-full bg-coral text-ivory text-sm font-medium hover:scale-105 transition-transform shadow-soft"
          >
            Réserver
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className={`lg:hidden p-2 ${textColor}`}
            aria-label="Menu"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-ivory/95 backdrop-blur-xl border-t border-border overflow-hidden"
          >
            <nav className="container mx-auto px-6 py-6 flex flex-col gap-3">
              {links.map((l) => {
                if ("hash" in l && l.hash) {
                  return (
                    <a
                      key={l.label}
                      href={`/#${l.hash}`}
                      onClick={(e) => {
                        setOpen(false);
                        if (pathname === "/") {
                          e.preventDefault();
                          document.getElementById(l.hash)?.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                      className="text-navy font-medium py-2 border-b border-border/40"
                    >
                      {l.label}
                    </a>
                  );
                }
                return (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="text-navy font-medium py-2 border-b border-border/40"
                  >
                    {l.label}
                  </Link>
                );
              })}
              <Link
                to="/contact"
                onClick={() => setOpen(false)}
                className="mt-2 text-center px-5 py-3 rounded-full bg-coral text-ivory"
              >
                Réserver
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
