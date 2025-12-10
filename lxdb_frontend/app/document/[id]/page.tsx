"use client";

import React, { use, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { ArrowLeft, Calendar, Landmark } from "lucide-react";
import PDFViewer from "@/components/PdfLoader";

import Link from "next/link";

interface DocumentData {
  id: string;
  full_title: string;
  short_title: string;
  published_at: string;
  authority: string;
  file: string;
  country: string;
  text: string;
}

interface DocumentViewProps {
  params: Promise<{ id: string }>;
}

const coatOfArms: Record<string, React.JSX.Element> = {
  du: (
    <Image
      src="/du_coat_of_arms.png"
      alt="Coat of Arms of the Duspean Republic"
      width={16}
      height={16}
    />
  ),
  cr: (
    <Image
      src="/cr_coat_of_arms.png"
      alt="Coat of Arms of the Country of Reality"
      width={16}
      height={16}
    />
  ),
};

function DocumentSkeleton({ tBanner }: { tBanner: any }) {
  return (
    <>
      <div className="flex gap-4 justify-center items-center w-full px-4 py-2 bg-gray-100 rounded-b-lg">
        <Image src="/du_coat_of_arms.png" alt={tBanner("du")} width={24} height={24} />
        <Image src="/cr_coat_of_arms.png" alt={tBanner("cr")} width={24} height={24} />
        <h5>{tBanner("text")}</h5>
      </div>
      <main className="flex w-full min-h-[calc(100vh-40px)] flex-col md:flex-row gap-6 p-8 bg-white dark:bg-black">
        <div className="flex flex-col gap-4 w-full">
          <div className="w-6 h-6 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          <div className="h-7 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-3/4" />
          <div className="flex flex-col gap-3">
            <div className="flex flex-row gap-2 items-center">
              <div className="w-5 h-5 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-32" />
            </div>
            <div className="flex flex-row gap-2 items-center">
              <div className="w-5 h-5 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-40" />
            </div>
            <div className="flex flex-row gap-2 items-center">
              <div className="w-5 h-5 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-48" />
            </div>
          </div>
        </div>
        <div className="w-full min-h-full p-2 rounded-lg bg-gray-200 dark:bg-gray-800 mt-4 md:mt-0 animate-pulse" style={{ width: "100%" }} />
      </main>
    </>
  );
}

export default function DocumentView({ params }: DocumentViewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [document, setDocument] = useState<DocumentData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { id } = use(params);
  const tBanner = useTranslations("banner");
  const tDoc = useTranslations("document");
  const tCountries = useTranslations("countries");

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(`/api/document/${id}`);
        const result = await response.json();
        if (result.success && result.document) {
          setDocument(result.document);
        } else {
          setError("Документ не найден");
        }
      } catch {
        setError("Ошибка загрузки документа");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [id]);

  if (isLoading) return <DocumentSkeleton tBanner={tBanner} />;
  
  if (error) return (
    <>
      <div className="flex gap-4 justify-center items-center w-full px-4 py-2 bg-gray-100 rounded-b-lg">
        <Image src="/du_coat_of_arms.png" alt={tBanner("du")} width={24} height={24} />
        <Image src="/cr_coat_of_arms.png" alt={tBanner("cr")} width={24} height={24} />
        <h5>{tBanner("text")}</h5>
      </div>
      <main className="flex w-full min-h-[calc(100vh-40px)] flex-col md:flex-row gap-6 p-8 bg-white dark:bg-black">
        <div className="flex flex-col gap-4 w-full">
          <Link href="/">
            <ArrowLeft className="transition-transform active:scale-80" />
          </Link>
          <h1 className="text-xl text-red-500 dark:text-white">{tDoc("notFound")}</h1>
          <div className="flex flex-col gap-3">
            <div className="flex flex-row gap-2 items-center">
              <div className="w-5 h-5 bg-gray-200 dark:bg-gray-800 rounded" />
              <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-32" />
            </div>
            <div className="flex flex-row gap-2 items-center">
              <div className="w-5 h-5 bg-gray-200 dark:bg-gray-800 rounded" />
              <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-40" />
            </div>
            <div className="flex flex-row gap-2 items-center">
              <div className="w-5 h-5 bg-gray-200 dark:bg-gray-800 rounded" />
              <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-48" />
            </div>
          </div>
        </div>
        <div className="w-full min-h-full p-2 rounded-lg bg-gray-200 dark:bg-gray-800 mt-4 md:mt-0" />
      </main>
    </>
  );
  
  if (!document) return (
    <>
      <div className="flex gap-4 justify-center items-center w-full px-4 py-2 bg-gray-100 rounded-b-lg">
        <Image src="/du_coat_of_arms.png" alt={tBanner("du")} width={24} height={24} />
        <Image src="/cr_coat_of_arms.png" alt={tBanner("cr")} width={24} height={24} />
        <h5>{tBanner("text")}</h5>
      </div>
      <main className="flex w-full min-h-[calc(100vh-40px)] items-center justify-center">
        <h1 className="text-xl">Документ не найден</h1>
      </main>
    </>
  );

  return (
    <>
      <div className="flex gap-4 justify-center items-center w-full px-4 py-2 bg-gray-100 rounded-b-lg">
        <Image src="/du_coat_of_arms.png" alt={tBanner("du")} width={24} height={24} />
        <Image src="/cr_coat_of_arms.png" alt={tBanner("cr")} width={24} height={24} />
        <h5>{tBanner("text")}</h5>
      </div>
      <main className="flex w-full min-h-[calc(100vh-40px)] flex-col md:flex-row gap-6 p-8 bg-white dark:bg-black">
        <div className="flex flex-col gap-4 w-full">
          <Link href="/">
            <ArrowLeft className="transition-transform active:scale-80" />
          </Link>
          <h1 className="text-xl text-zinc-900">{document.short_title}</h1>
          <h3 className="text-base text-zinc-600">{document.full_title}</h3>
          <div className="flex flex-col gap-1">
            <div className="flex flex-row gap-3 md:gap-2 items-center">
              <div>{coatOfArms[document.country]}</div>
              <h3 className="text-md leading-5.5">
                {tDoc("country", { country: tCountries(document.country) })}
              </h3>
            </div>
            <div className="flex flex-row gap-3 md:gap-2 items-center">
              <div><Calendar size={16} /></div>
              <h3 className="text-md leading-5.5">
                {tDoc("published", {
                  date: new Date(document.published_at).toLocaleDateString("ru-RU", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  }),
                })}
              </h3>
            </div>
            <div className="flex flex-row gap-3 md:gap-2 items-center">
              <div><Landmark size={16} /></div>
              <h3 className="text-md leading-5.5">
                {document.authority}
              </h3>
            </div>
          </div>
        </div>
        <PDFViewer file={document.file} />
      </main>
    </>
  );
}