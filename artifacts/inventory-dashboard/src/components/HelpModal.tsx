import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

type HelpModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function HelpModal({ open, onOpenChange }: HelpModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col gap-0 p-0">
        <div className="p-6 pb-4 border-b border-border">
          <DialogHeader>
            <DialogTitle className="text-2xl">Help Center</DialogTitle>
            <DialogDescription>
              Find answers to common questions and learn how to use Aero Logistics.
            </DialogDescription>
          </DialogHeader>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search for help..." />
          </div>
        </div>

        <div className="overflow-y-auto p-6 pt-2">
          <Accordion type="multiple" className="w-full">
            <h3 className="font-semibold text-lg mt-4 mb-2 text-primary">Getting Started</h3>
            <AccordionItem value="gs-1">
              <AccordionTrigger>How do I navigate the dashboard?</AccordionTrigger>
              <AccordionContent>
                Use the sidebar on the left to access different modules. The dashboard provides a high-level overview, while specific sections like Products and Orders allow you to manage data in detail.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="gs-2">
              <AccordionTrigger>How do I change my theme or colorblind settings?</AccordionTrigger>
              <AccordionContent>
                Navigate to the Settings page via the sidebar. There you can toggle colorblind mode, and adjust notification preferences. Dark mode can be toggled using the icon in the top header.
              </AccordionContent>
            </AccordionItem>

            <h3 className="font-semibold text-lg mt-8 mb-2 text-primary">Stock Management</h3>
            <AccordionItem value="sm-1">
              <AccordionTrigger>What do the stock status indicators mean?</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li><strong>Healthy:</strong> Stock is well above the reorder point.</li>
                  <li><strong>Low:</strong> Stock is approaching the reorder point.</li>
                  <li><strong>Critical:</strong> Stock is below the reorder point and needs immediate attention.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="sm-2">
              <AccordionTrigger>How are reorder points calculated?</AccordionTrigger>
              <AccordionContent>
                Currently, reorder points are manually set per product in the Product Catalog. You can edit a product to adjust its reorder threshold.
              </AccordionContent>
            </AccordionItem>

            <h3 className="font-semibold text-lg mt-8 mb-2 text-primary">Orders</h3>
            <AccordionItem value="ord-1">
              <AccordionTrigger>How do I track an order?</AccordionTrigger>
              <AccordionContent>
                Go to the Orders page. Each order has a status (Pending, Processing, Delivered, Cancelled). You can click on an order to see more details and estimated delivery dates.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </DialogContent>
    </Dialog>
  );
}
