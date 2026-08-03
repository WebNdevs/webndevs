/// <reference types="vite/client" />

declare module "@figma/astraui";
declare module "lucide-react";

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
