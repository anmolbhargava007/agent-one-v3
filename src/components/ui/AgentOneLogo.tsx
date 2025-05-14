
import { cn } from "@/lib/utils";

interface AgentOneLogoProps {
  size?: number;
  className?: string;
  variant?: "default" | "icon";
}

const AgentOneLogo = ({ size = 40, className, variant = "default" }: AgentOneLogoProps) => {
  return (
    <div 
      className={cn(
        "flex items-center justify-center",
        className
      )}
    >
      {variant === "default" ? (
        // Full logo with text and icon
        <div className="flex items-center">
          <img 
            src="/images/e2a2616f-9ef6-4227-bad9-420362a39663.png" 
            alt="Agent One Logo" 
            style={{ height: `${size}px` }}
            className="h-full"
          />
        </div>
      ) : (
        // Icon only for smaller displays
        <div 
          className="relative"
          style={{ width: size, height: size }}
        >
          <img 
            src="/images/39751f20-ba1d-46bc-92bb-04ad8146598f.png" 
            alt="Agent One Icon" 
            className="h-full w-full object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default AgentOneLogo;
