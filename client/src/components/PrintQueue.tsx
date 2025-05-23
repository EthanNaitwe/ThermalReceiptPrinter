import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Inbox } from "lucide-react";

export default function PrintQueue() {
  const { data: pendingJobs = [], isLoading } = useQuery({
    queryKey: ["/api/print-jobs/pending"],
    refetchInterval: 2000,
  });

  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <CardContent className="p-6">
        <h4 className="text-lg font-semibold text-[#212121] mb-4">Print Queue</h4>
        
        {isLoading ? (
          <div className="text-center text-[#757575] py-8">
            <p>Loading queue...</p>
          </div>
        ) : pendingJobs.length === 0 ? (
          <div className="text-center text-[#757575] py-8">
            <Inbox className="mx-auto h-12 w-12 mb-3 text-gray-300" />
            <p className="font-medium">No pending print jobs</p>
            <p className="text-sm mt-1">All receipts have been processed</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingJobs.map((job: any, index: number) => (
              <div key={job.id} className="bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-[#212121]">
                    Print Job #{job.id}
                  </span>
                  <span className="text-xs text-[#757575] bg-yellow-100 px-2 py-1 rounded">
                    {job.status}
                  </span>
                </div>
                <p className="text-xs text-[#757575] mt-1">
                  Created: {new Date(job.createdAt).toLocaleTimeString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
