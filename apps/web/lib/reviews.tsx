"use client";
// Konteks tinjauan: ambil keputusan reviewer/admin sekali, sediakan per-ref.
// Badge kepercayaan memakai ini utk menampilkan status TERVALIDASI (override otomatis).
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { ReviewOverride } from "./evalgate";

type ReviewMap = Record<string, ReviewOverride>;
const Ctx = createContext<ReviewMap>({});

export function ReviewProvider({ children }: { children: ReactNode }) {
  const [map, setMap] = useState<ReviewMap>({});
  useEffect(() => {
    let alive = true;
    fetch("/api/v1/reviews")
      .then((r) => r.json())
      .then((j) => {
        if (!alive) return;
        const m: ReviewMap = {};
        for (const rv of j.reviews ?? [])
          m[rv.ref] = { decision: rv.decision, statusOverride: rv.statusOverride, note: rv.note, reviewerName: rv.reviewerName };
        setMap(m);
      })
      .catch(() => {});
    return () => { alive = false; };
  }, []);
  return <Ctx.Provider value={map}>{children}</Ctx.Provider>;
}

export function useReview(ref?: string): ReviewOverride | undefined {
  const map = useContext(Ctx);
  return ref ? map[ref] : undefined;
}
