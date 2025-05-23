import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import type { ReceiptItem } from "@shared/schema";

interface ReceiptPreviewProps {
  receiptData: {
    storeName: string;
    orderNumber: string;
    customer: string;
    date: string;
    items: ReceiptItem[];
  };
  subtotal: number;
  tax: number;
  total: number;
}

export default function ReceiptPreview({ receiptData, subtotal, tax, total }: ReceiptPreviewProps) {
  const [showPreview, setShowPreview] = useState(true);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US") + " " + date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#212121]">Receipt Preview</h3>
          <Button 
            onClick={() => setShowPreview(!showPreview)}
            variant="ghost"
            className="text-[#2196F3] hover:text-blue-600 text-sm font-medium"
          >
            <Eye className="mr-1 h-4 w-4" />
            {showPreview ? "Hide" : "Preview"}
          </Button>
        </div>
        
        {showPreview && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="bg-white p-6 rounded border-2 border-dashed border-gray-300 thermal-receipt text-sm max-w-xs mx-auto">
              <div className="text-center mb-4">
                <h4 className="font-bold text-base">{receiptData.storeName.toUpperCase()}</h4>
                <p className="text-xs text-[#757575]">123 Main Street</p>
                <p className="text-xs text-[#757575]">City, ST 12345</p>
              </div>
              
              <div className="border-t border-b border-gray-300 py-2 my-4">
                <div className="flex justify-between text-xs">
                  <span>Order:</span>
                  <span>{receiptData.orderNumber}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Date:</span>
                  <span>{formatDate(receiptData.date)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Customer:</span>
                  <span>{receiptData.customer}</span>
                </div>
              </div>
              
              <div className="space-y-1 mb-4">
                {receiptData.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-xs">
                    <span>{item.name}</span>
                    <span>${item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-300 pt-2">
                <div className="flex justify-between text-xs mb-1">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Tax:</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="text-center mt-4 text-xs text-[#757575]">
                <p>Thank you for your business!</p>
                <p>Powered by Square</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
