declare module "next-pwa" {
  import { NextConfig } from "next";

  interface PWAConfig {
    dest?: string;
    disable?: boolean;
    register?: string;
    scope?: string;
    sw?: string;
    publicExcludes?: string[];
    buildExcludes?: string[];
    manifestMask?: string;
    manifestStart?: string;
    manifestScope?: string;
    manifestDisplay?: string;
    manifestStartUrl?: string;
    manifestIcon?: string;
    manifestIconOptions?: {
      size?: number;
      purpose?: string;
    };
    manifestThemeColor?: string;
    manifestBackgroundColor?: string;
    [key: string]: unknown;
  }

  function withPWA(config: PWAConfig): (nextConfig: NextConfig) => NextConfig;
  export default withPWA;
}
