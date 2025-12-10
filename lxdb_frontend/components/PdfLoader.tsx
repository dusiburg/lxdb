"use client";
import dynamic from "next/dynamic";

const LoadingSkeleton = () => (
  <div className="w-full max-w-[800px] min-h-[1100px] p-2 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
);

const PdfViewerClient = dynamic(() => import("./PdfViewerClient"), {
  ssr: false,
  loading: LoadingSkeleton,
});

const PdfViewer = ({ file }: { file: File | string }) => {
  return <PdfViewerClient file={file} />;
};

export default PdfViewer;