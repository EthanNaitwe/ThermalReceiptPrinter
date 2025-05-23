import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer, TestTube, Settings } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { PrintStatus, ReceiptItem } from "@shared/schema";

interface PrintControlProps {
  printStatus: PrintStatus;
  setPrintStatus: (status: PrintStatus) => void;
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

export default function PrintControl({ 
  printStatus, 
  setPrintStatus, 
  receiptData, 
  subtotal, 
  tax, 
  total 
}: PrintControlProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createReceiptMutation = useMutation({
    mutationFn: async (receiptData: any) => {
      return await apiRequest("POST", "/api/receipts", receiptData);
    },
    onSuccess: async (response) => {
      const receipt = await response.json();
      // Now print the receipt
      const printResponse = await apiRequest("POST", "/api/print", { receiptId: receipt.id });
      const printJob = await printResponse.json();
      
      setPrintStatus("printing");
      
      // Poll for print job completion
      const pollPrintJob = async () => {
        try {
          const jobResponse = await apiRequest("GET", `/api/print-jobs/${printJob.id}`);
          const job = await jobResponse.json();
          
          if (job.status === "completed") {
            setPrintStatus("success");
            toast({
              title: "Print Successful",
              description: "Receipt printed successfully",
            });
            queryClient.invalidateQueries({ queryKey: ["/api/print-jobs"] });
            queryClient.invalidateQueries({ queryKey: ["/api/print-jobs/pending"] });
          } else if (job.status === "failed") {
            setPrintStatus("error");
            toast({
              title: "Print Failed",
              description: job.errorMessage || "Unknown error occurred",
              variant: "destructive",
            });
          } else {
            // Still pending/printing, continue polling
            setTimeout(pollPrintJob, 1000);
          }
        } catch (error) {
          setPrintStatus("error");
          toast({
            title: "Print Failed",
            description: "Failed to check print status",
            variant: "destructive",
          });
        }
      };
      
      setTimeout(pollPrintJob, 1000);
    },
    onError: () => {
      setPrintStatus("error");
      toast({
        title: "Print Failed",
        description: "Failed to create receipt",
        variant: "destructive",
      });
    },
  });

  const testPrintMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/print/test"),
    onSuccess: () => {
      setPrintStatus("printing");
      setTimeout(() => {
        setPrintStatus("success");
        toast({
          title: "Test Print Successful",
          description: "Test page printed successfully",
        });
      }, 1000);
    },
    onError: () => {
      setPrintStatus("error");
      toast({
        title: "Test Print Failed",
        description: "Failed to print test page",
        variant: "destructive",
      });
    },
  });

  const handlePrint = () => {
    if (printStatus === "printing") return;

    const receiptPayload = {
      storeName: receiptData.storeName,
      orderNumber: receiptData.orderNumber,
      customer: receiptData.customer,
      items: JSON.stringify(receiptData.items),
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2),
    };

    createReceiptMutation.mutate(receiptPayload);
  };

  const handleTestPrint = () => {
    testPrintMutation.mutate();
  };

  const isDisabled = printStatus === "printing";

  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <CardContent className="p-8">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-[#212121] mb-6">Print Receipt</h3>
          
          <Button 
            onClick={handlePrint}
            disabled={isDisabled}
            className={`w-full py-6 px-8 text-xl font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl mb-6 print-button ${
              isDisabled 
                ? 'opacity-75 cursor-not-allowed' 
                : 'bg-[#2196F3] hover:bg-blue-600 text-white'
            }`}
          >
            <Printer className="mr-3 h-6 w-6" />
            {printStatus === "printing" ? "Printing..." : "Print Receipt"}
          </Button>
          
          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={handleTestPrint}
              disabled={isDisabled}
              variant="secondary"
              className="bg-gray-100 hover:bg-gray-200 text-[#212121] font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            >
              <TestTube className="mr-2 h-4 w-4" />
              Test Print
            </Button>
            <Button 
              disabled={isDisabled}
              variant="secondary"
              className="bg-gray-100 hover:bg-gray-200 text-[#212121] font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
