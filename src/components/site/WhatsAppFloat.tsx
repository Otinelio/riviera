import { MessageCircle } from "lucide-react";
import { waLink } from "@/lib/hotel";

export default function WhatsAppFloat() {
  return (
    <a
      href={waLink("Bonjour, je souhaite des informations sur l'Hotel Riviera Ramatou Plage.")}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-tropical text-ivory flex items-center justify-center shadow-elegant pulse-ring relative hover:scale-110 transition-transform"
      aria-label="WhatsApp"
    >
      <MessageCircle size={26} />
    </a>
  );
}
