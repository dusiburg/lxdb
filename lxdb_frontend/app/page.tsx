"use client";

import { FilterPanel } from "@/components/FilterPanel";
import { Calendar, Landmark, Loader2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import Link from "next/link";

interface Document {
  id: string;
  full_title: string;
  short_title: string;
  published_at: string;
  authority: string;
  file: string;
  country: string;
  text: string;
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [documents, setDocuments] = useState<Document[]>([]);

  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [country, setCountry] = useState("all");

  const t = useTranslations();

  useEffect(() => {
    (async () => {
      const response = await fetch("/api/documents");
      const result = await response.json();

      const docs = Array.isArray(result)
        ? result
        : (result.documents ?? result.docuemnts ?? []);

      setDocuments(docs);
      setIsLoading(false);
    })();
  }, []);

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesTitle = title
        ? doc.full_title.toLowerCase().includes(title.toLowerCase())
        : true;

      const matchesDate = date
        ? new Date(doc.published_at).toLocaleDateString("ru-RU") ===
          date.toLocaleDateString("ru-RU")
        : true;

      const matchesCountry = country === "all" || doc.country === country;

      return matchesTitle && matchesDate && matchesCountry;
    });
  }, [documents, title, date, country]);

  return (
    <>
      <div className="flex gap-4 justify-center items-center w-full px-4 py-2 bg-gray-100 rounded-b-lg">
        <Image src="/du_coat_of_arms.png" alt={t("banner.du")} width={24} height={24} />
        <Image src="/cr_coat_of_arms.png" alt={t("banner.cr")} width={24} height={24} />
        <h5>{t("banner.text")}</h5>
      </div>

      <div className="min-h-[calc(100vh-40px)] flex justify-center bg-zinc-50 font-sans dark:bg-black">
        <main className="flex w-full max-w-3xl min-h-[calc(100vh-40px)] flex-col gap-4 p-8 bg-white dark:bg-black sm:items-start">
          <h1 className="text-xl text-zinc-900 dark:text-white">{t("title")}</h1>

          <FilterPanel title={title} setTitle={setTitle} date={date} setDate={setDate} country={country} setCountry={setCountry} />

          {isLoading ? (
            <div className="flex flex-row justify-center w-full mt-6">
              <Loader2 className="animate-spin" />
            </div>
          ) : filteredDocuments.length > 0 ? (
            <div className="flex flex-col gap-2.5 mt-2 w-full">
              {filteredDocuments.map((document) => (
                <Link href={`/document/${document.id}`} className="flex flex-col gap-1.5 bg-gray-50 rounded-lg py-2.5 px-3 transition-transform active:scale-96" key={document.id}>
                  <h3 className="text-lg leading-6.5">{document.full_title}</h3>
                  <div className="flex flex-col md:flex-row md:gap-2 text-sm">
                    <div className="flex flex-row gap-1.5 items-center">
                      <Calendar className="text-zinc-800" size={14} />
                      <p className="text-md text-zinc-800">
                        {new Date(document.published_at).toLocaleDateString(
                          "ru-RU", { day: "2-digit", month: "long", year: "numeric" }
                        )}
                      </p>
                    </div>
                    <div className="flex flex-row gap-1.5 items-center">
                      <Landmark className="text-zinc-800" size={14} />
                      <p className="text-md text-zinc-800 truncate">{document.authority}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <Empty className="w-full">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <X />
                </EmptyMedia>
                <EmptyTitle>{t("notFound.title")}</EmptyTitle>
                <EmptyDescription>{t("notFound.description")}</EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </main>
      </div>
    </>
  );
}