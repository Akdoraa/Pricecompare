import { useEffect } from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import { Loader2 } from "lucide-react";

interface RedirectModalProps {
  store: string | null;
  url: string | null;
  onClose: () => void;
}

export function RedirectModal({ store, url, onClose }: RedirectModalProps) {
  useEffect(() => {
    if (store && url) {
      const timer = setTimeout(() => {
        window.open(url, "_blank", "noopener,noreferrer");
        onClose();
      }, 1200);
      
      return () => clearTimeout(timer);
    }
  }, [store, url, onClose]);

  return (
    <Dialog open={!!store} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mb-6" />
          
          <h3 className="text-lg font-semibold text-card-foreground mb-2">
            Redirecting to {store}...
          </h3>
          
          <p className="text-sm text-muted-foreground max-w-xs">
            We may earn a small commission at no extra cost to you.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
