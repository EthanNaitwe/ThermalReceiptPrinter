import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Loader2, AlertTriangle } from "lucide-react";
import type { PrintStatus } from "@shared/schema";

interface PrintFeedbackProps {
  printStatus: PrintStatus;
}

export default function PrintFeedback({ printStatus }: PrintFeedbackProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <CardContent className="p-6">
        <h4 className="text-lg font-semibold text-[#212121] mb-4">Print Status</h4>
        
        {printStatus === "success" && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-3">
            <div className="flex items-center space-x-3">
              <CheckCircle className="text-[#4CAF50] h-5 w-5" />
              <div>
                <p className="font-medium text-[#4CAF50]">Print Successful</p>
                <p className="text-sm text-[#757575]">Receipt printed at {formatTime(new Date())}</p>
              </div>
            </div>
          </div>
        )}

        {printStatus === "printing" && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-3">
            <div className="flex items-center space-x-3">
              <Loader2 className="animate-spin text-[#2196F3] h-5 w-5" />
              <div>
                <p className="font-medium text-[#2196F3]">Printing...</p>
                <p className="text-sm text-[#757575]">Sending data to printer</p>
              </div>
            </div>
          </div>
        )}

        {printStatus === "error" && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="text-[#F44336] h-5 w-5" />
              <div>
                <p className="font-medium text-[#F44336]">Print Failed</p>
                <p className="text-sm text-[#757575]">Check printer connection</p>
              </div>
            </div>
          </div>
        )}

        {printStatus === "ready" && (
          <div className="text-center text-[#757575] py-4">
            <p className="font-medium">Ready to print</p>
            <p className="text-sm">Click the print button to start</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
