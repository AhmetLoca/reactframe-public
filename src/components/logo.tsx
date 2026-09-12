import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex select-none items-center text-foreground", className)}>
      <svg
        viewBox="0 0 1341 125"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ height: "0.85em", width: "auto" }}
        aria-label="ReactFrame"
        role="img"
      >
        <path d="M1327.38 9H1245.01M1312.81 62.2129H1245.01M1327.38 115.426H1245.01" stroke="currentColor" strokeWidth="14" strokeLinecap="round" />
        <path
          d="M1103.8 8L1103.8 116.563M1203.01 8L1203.01 116.563M1202.75 8.28174L1153.62 88.1837M1104.42 8.28174L1153.55 88.1837"
          stroke="currentColor"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d="M835.738 71.5112L835.738 117.435M836.104 70.7784C836.104 70.7784 878.748 70.7816 887.13 70.7783C895.512 70.775 915.559 58.7508 915.559 37.6157C915.559 16.4807 896.241 7 887.13 7H836.104M884.578 74.062L911.405 116.809"
          stroke="currentColor"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path d="M1009.31 9.00121L957.559 116.928M1010.24 9L1061.8 116.929" stroke="currentColor" strokeWidth="14" strokeLinecap="round" />
        <path
          d="M712.096 117.342V13.8316C712.096 10.6109 714.707 8 717.927 8H793.738M713.918 71.0537L780.252 71.0537"
          stroke="currentColor"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path d="M632.058 10H540.211M586.134 10L586.134 113.51" stroke="currentColor" strokeWidth="14" strokeLinecap="round" />
        <path
          d="M498.211 10H449.736C425.681 10 400.018 24.1416 399.439 61.7552C398.86 99.3688 424.952 113.51 449.736 113.51H498.211"
          stroke="currentColor"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path d="M304.946 8.00121L253.191 115.928M305.871 8L357.43 115.929" stroke="currentColor" strokeWidth="14" strokeLinecap="round" />
        <path d="M211.191 9H128.82M196.613 62.2129H128.821M211.191 115.426H128.82" stroke="currentColor" strokeWidth="14" strokeLinecap="round" />
        <path
          d="M7 71.5112L7 117.435M7.36591 70.7784C7.36591 70.7784 50.0093 70.7816 58.3914 70.7783C66.7736 70.775 86.8203 58.7508 86.8203 37.6157C86.8203 16.4807 67.5025 7 58.3914 7H7.36591M55.8398 74.063L82.6669 116.81"
          stroke="currentColor"
          strokeWidth="14"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
