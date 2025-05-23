import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";

export default function PrinterStatus() {
  const { data: printJobs = [] } = useQuery({
    queryKey: ["/api/print-jobs/pending"],
    refetchInterval: 5000,
  });

  const queueCount = printJobs.length;

  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-[#212121]">Printer Status</h2>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-[#4CAF50] rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-[#4CAF50]">Connected</span>
          </div>
        </div>
        
        <div className="mb-6">
          <img 
            src="https://images.unsplash.com/photo-1606947194230-26688772a618?w=400&h=200&fit=crop&crop=center" 
            alt="Thermal receipt printer" 
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-[#757575]">Model:</span>
            <p className="font-medium text-[#212121]">Epson TM-T88VI</p>
          </div>
          <div>
            <span className="text-[#757575]">Paper:</span>
            <p className="font-medium text-[#212121]">Ready</p>
          </div>
          <div>
            <span className="text-[#757575]">Queue:</span>
            <p className="font-medium text-[#212121]">{queueCount} jobs</p>
          </div>
          <div>
            <span className="text-[#757575]">Last Print:</span>
            <p className="font-medium text-[#212121]">2 min ago</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
