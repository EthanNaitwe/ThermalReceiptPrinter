import { useState } from "react";
import PrinterStatus from "@/components/PrinterStatus";
import PrintControl from "@/components/PrintControl";
import PrintFeedback from "@/components/PrintFeedback";
import ReceiptDataInput from "@/components/ReceiptDataInput";
import ReceiptPreview from "@/components/ReceiptPreview";
import PrintQueue from "@/components/PrintQueue";
import type { PrintStatus, ReceiptItem } from "@shared/schema";

export default function PrinterPage() {
  const [printStatus, setPrintStatus] = useState<PrintStatus>("ready");
  const [receiptData, setReceiptData] = useState({
    storeName: "Square Coffee Shop",
    orderNumber: "#12345",
    customer: "John Doe",
    date: new Date().toISOString().split('T')[0],
    items: [
      { name: "Cappuccino (L)", price: 4.50, quantity: 1 },
      { name: "Blueberry Muffin", price: 3.25, quantity: 1 },
      { name: "Extra Shot", price: 0.75, quantity: 1 },
    ] as ReceiptItem[],
  });

  const subtotal = receiptData.items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Header Section */}
      <div className="max-w-4xl mx-auto px-4 mb-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#212121] mb-2">Thermal Receipt Printer</h1>
          <p className="text-[#757575]">Square POS-inspired printing interface</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-2 gap-8">
        {/* Left Column: Print Interface */}
        <div className="space-y-6">
          <PrinterStatus />
          <PrintControl 
            printStatus={printStatus}
            setPrintStatus={setPrintStatus}
            receiptData={receiptData}
            subtotal={subtotal}
            tax={tax}
            total={total}
          />
          <PrintFeedback printStatus={printStatus} />
        </div>

        {/* Right Column: Receipt Preview */}
        <div className="space-y-6">
          <ReceiptDataInput 
            receiptData={receiptData}
            setReceiptData={setReceiptData}
          />
          <ReceiptPreview 
            receiptData={receiptData}
            subtotal={subtotal}
            tax={tax}
            total={total}
          />
          <PrintQueue />
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-6xl mx-auto px-4 mt-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-[#757575]">
            <div className="flex items-center space-x-4 mb-2 sm:mb-0">
              <span>Thermal Printer System v1.0</span>
              <span className="hidden sm:inline">•</span>
              <span>React Integration Ready</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-[#4CAF50] rounded-full"></div>
              <span>System Online</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
