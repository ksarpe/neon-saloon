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
  const { hidden: backHidden } = useBackButton();
  const isHome = pathname === "/";
  const isActiveGame = /^\/(host|join)\/.+/.test(pathname);

  return (
    <>
      <AnimatePresence mode="sync" initial={false}>
        <motion.div
          key={pathname}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ x: "-100%", opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="fixed inset-0 z-10 overflow-y-auto page-slide"
        >
          {children}
        </motion.div>
      </AnimatePresence>

      {!isHome && !isActiveGame && !backHidden && (
        <motion.button
          key={`back-${pathname}`}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.2 }}
          onClick={() => router.back()}
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
