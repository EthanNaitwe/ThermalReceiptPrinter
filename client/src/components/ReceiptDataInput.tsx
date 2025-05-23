import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ReceiptItem } from "@shared/schema";

interface ReceiptDataInputProps {
  receiptData: {
    storeName: string;
    orderNumber: string;
    customer: string;
    date: string;
    items: ReceiptItem[];
  };
  setReceiptData: (data: any) => void;
}

export default function ReceiptDataInput({ receiptData, setReceiptData }: ReceiptDataInputProps) {
  const handleInputChange = (field: string, value: string) => {
    setReceiptData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-[#212121] mb-4">Receipt Data</h3>
        
        <div className="space-y-4">
          <div>
            <Label className="block text-sm font-medium text-[#757575] mb-2">Store Name</Label>
            <Input 
              type="text" 
              value={receiptData.storeName}
              onChange={(e) => handleInputChange('storeName', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2196F3] focus:border-transparent outline-none transition-colors" 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="block text-sm font-medium text-[#757575] mb-2">Order #</Label>
              <Input 
                type="text" 
                value={receiptData.orderNumber}
                onChange={(e) => handleInputChange('orderNumber', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2196F3] focus:border-transparent outline-none transition-colors" 
              />
            </div>
            <div>
              <Label className="block text-sm font-medium text-[#757575] mb-2">Date</Label>
              <Input 
                type="date" 
                value={receiptData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2196F3] focus:border-transparent outline-none transition-colors" 
              />
            </div>
          </div>

          <div>
            <Label className="block text-sm font-medium text-[#757575] mb-2">Customer</Label>
            <Input 
              type="text" 
              value={receiptData.customer}
              onChange={(e) => handleInputChange('customer', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2196F3] focus:border-transparent outline-none transition-colors" 
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
