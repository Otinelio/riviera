import type { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import WhatsAppFloat from "./WhatsAppFloat";
import PageTransition from "./PageTransition";

export default function SiteLayout({
  children,
  transparentNav = true,
}: {
  children: ReactNode;
  transparentNav?: boolean;
}) {
  return (
    <div className="min-h-screen bg-ivory text-foreground">
      <Navbar transparentOverHero={transparentNav} />
      <PageTransition>{children}</PageTransition>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}

export function PageHero({
  image,
  eyebrow,
  title,
  subtitle,
  breadcrumb,
  overlay = "from-navy/70 via-navy/40 to-ivory",
}: {
  image: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  breadcrumb?: string;
  overlay?: string;
}) {
  return (
    <section className="relative h-[72vh] min-h-[480px] w-full overflow-hidden">
      <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover scale-105" loading="eager" />
      <div className={`absolute inset-0 bg-gradient-to-b ${overlay}`} />
      <div className="relative h-full container mx-auto px-6 flex flex-col justify-end pb-20">
        {breadcrumb && (
          <div className="text-ivory/80 text-xs tracking-[0.3em] uppercase mb-3">{breadcrumb}</div>
        )}
        {eyebrow && <div className="text-sand text-xs tracking-[0.4em] uppercase mb-3">{eyebrow}</div>}
        <h1 className="font-display text-5xl md:text-7xl text-ivory text-balance leading-[1.05]">{title}</h1>
        {subtitle && <p className="mt-4 text-ivory/85 text-lg md:text-xl max-w-2xl">{subtitle}</p>}
      </div>
    </section>
  );
}
