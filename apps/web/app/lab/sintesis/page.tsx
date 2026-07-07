import Link from "next/link";
import { notFound } from "next/navigation";
import { getLabSynthesis } from "@/lib/lab";
import { LabSynthesisView } from "@/components/LabSynthesisView";

export const metadata = { title: "Sintesis Lintas-Kajian — Lab Tadabbur" };

export default async function LabSynthesisPage() {
  const syn = await getLabSynthesis();
  if (!syn) notFound();
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mut text-xs"><Link href="/lab" className="hover:underline">🧪 Lab Tadabbur</Link> / sintesis</div>
      <LabSynthesisView syn={syn} />
    </div>
  );
}
