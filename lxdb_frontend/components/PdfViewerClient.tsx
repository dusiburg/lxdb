"use client";
import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();


const PdfViewerClient = ({ file }: { file: string | File }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageWidth, setPageWidth] = useState(800);
  const t = useTranslations("document");

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const goToPrevPage = () =>
    setPageNumber(pageNumber - 1 <= 1 ? 1 : pageNumber - 1);

  const goToNextPage = () =>
    setPageNumber(pageNumber + 1 >= (numPages ?? 0) ? (numPages ?? 0) : pageNumber + 1);

  useEffect(() => {
    const updateWidth = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setPageWidth(width - 64);
      } else if (width < 1024) {
        setPageWidth(Math.min(600, width - 64));
      } else {
        setPageWidth(800);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-row items-center gap-4">
        <div className="flex flex-row items-center gap-2">
          <ArrowLeft
            className={
              pageNumber <= 1
                ? "text-muted-foreground"
                : "cursor-pointer transition-transform active:scale-80"
            }
            onClick={pageNumber <= 1 ? undefined : goToPrevPage}
          />
          <ArrowRight
            className={
              pageNumber >= (numPages ?? 0)
                ? "text-muted-foreground"
                : "cursor-pointer transition-transform active:scale-80"
            }
            onClick={pageNumber >= (numPages ?? 0) ? undefined : goToNextPage}
          />
        </div>
        <p className="text-sm md:text-base">
          {t("page")} {pageNumber} {t("of")} {numPages || "..."}
        </p>
      </div>
      <div className="flex h-full justify-center border-6 border-gray-200 rounded-lg overflow-hidden w-full">
        <Document
          className="py-4"
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
        >
          <Page
            pageNumber={pageNumber}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            width={pageWidth}
          />
        </Document>
      </div>
    </div>
  );
};

export default PdfViewerClient;