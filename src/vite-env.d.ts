/// <reference types="vite/client" />

declare module "*.svg?react" {
  import React from "react";
  const content: React.FunctionComponent<React.SVGProps<SVGSVGElement> & {
    title?: string;
  }>;
  export default content;
}
