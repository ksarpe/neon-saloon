"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useBackButton } from "@/lib/back-button-context";

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { hidden: backHidden, onBack } = useBackButton();
  const isHome = pathname === "/" || pathname === "/graj";

  function getBackHref(): string {
    if (pathname.startsWith("/graj/")) return "/graj";
    if (pathname === "/panel") return "/graj";
    if (pathname === "/login") return "/";
    return "/";
  }

  const handleBack = () => {
    if (onBack) onBack();
    else router.push(getBackHref());
  };

  return (
    <>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: "easeInOut" }}
          className="fixed inset-0 z-10 overflow-y-auto"
        >
          {children}
        </motion.div>
      </AnimatePresence>

      {!isHome && !backHidden && (
        <motion.button
          key={`back-${pathname}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.18, ease: "easeInOut" }}
          onClick={handleBack}
          className="fixed top-2 left-4 z-50 flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold cursor-pointer"
          style={{
            borderColor: "rgba(255,220,180,0.2)",
            backgroundColor: "rgba(10,4,20,0.55)",
            color: "rgba(255,220,180,0.75)",
            backdropFilter: "blur(8px)",
          }}
          whileHover={{
            borderColor: "rgba(255,220,180,0.45)",
            color: "rgba(255,220,180,1)",
            transition: { duration: 0 },
          }}
          whileTap={{ scale: 0.95, transition: { duration: 0 } }}
        >
          <ArrowLeft size={13} />
          Wróć
        </motion.button>
      )}
    </>
  );
}
