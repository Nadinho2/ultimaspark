"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { CertificatePDF } from "@/components/CertificatePDF";
import { claimCertificate } from "@/app/actions/certificates";

type CertificateDownloadButtonProps = {
  userName: string;
  courseName: string;
  courseSlug: string;
};

export function CertificateDownloadButton({
  userName,
  courseName,
  courseSlug,
}: CertificateDownloadButtonProps) {
  const date = new Date();
  const dateString = date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
  const certificateId = (typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`)
    .slice(0, 8);

  const [claimed, setClaimed] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleClick = () => {
    if (claimed || isPending) return;
    startTransition(async () => {
      const result = await claimCertificate(courseSlug);
      if (result.success) {
        setClaimed(true);
        router.refresh();
      }
    });
  };

  return (
    <PDFDownloadLink
      document={
        <CertificatePDF
          userName={userName}
          courseName={courseName}
          dateString={dateString}
          certificateId={certificateId}
        />
      }
      fileName="ultimaspark-certificate.pdf"
      className="inline-flex"
    >
      {({ loading }) => (
        <button
          type="button"
          onClick={handleClick}
          className="mt-4 inline-flex items-center justify-center rounded-xl bg-spark px-6 py-3 text-xs font-semibold text-bg shadow-sm transition hover:bg-spark/90 disabled:opacity-70"
          disabled={loading || claimed || isPending}
        >
          {claimed ? "Certificate Claimed" : loading ? "Preparing Certificate..." : "Claim Certificate"}
        </button>
      )}
    </PDFDownloadLink>
  );
}

