import React from "react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UploadCloud, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function LabDashboard() {
  const { addReport, logout } = useApp();
  const { toast } = useToast();
  const [file, setFile] = React.useState<File | null>(null);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    // Simulate upload and processing
    toast({ title: "Uploading...", description: "Encrypting and uploading file to secure storage." });
    
    setTimeout(() => {
      addReport({
        patientId: "p1",
        title: "Complete Blood Count (New)",
        type: "blood",
        date: new Date().toISOString().split('T')[0],
        uploadedBy: "City Diagnostic Centre"
      });
      toast({ 
        title: "Upload Successful", 
        description: "Report added to patient's record. AI processing started." 
      });
      setFile(null);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b p-4 flex justify-between items-center">
        <span className="font-bold text-lg">City Diagnostic Portal</span>
        <Button variant="ghost" onClick={logout}>Logout</Button>
      </header>

      <main className="p-8 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Upload Patient Report</h1>
        
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleUpload} className="space-y-6">
              <div className="space-y-2">
                <Label>Patient ABHA ID</Label>
                <Input placeholder="Enter Patient ID" defaultValue="1234-5678-9012" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Report Type</Label>
                  <Select defaultValue="blood">
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blood">Blood Test</SelectItem>
                      <SelectItem value="radiology">Radiology (X-Ray/CT)</SelectItem>
                      <SelectItem value="urine">Urine Analysis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Date of Test</Label>
                  <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Report File (PDF/Image)</Label>
                <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition cursor-pointer">
                  <UploadCloud className="h-10 w-10 text-slate-400 mb-2" />
                  <p className="text-sm text-slate-600 font-medium">Click to upload or drag and drop</p>
                  <p className="text-xs text-slate-400">PDF, JPG, PNG up to 10MB</p>
                  <Input 
                    type="file" 
                    className="hidden" 
                    id="file-upload" 
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                  <label htmlFor="file-upload" className="absolute inset-0 cursor-pointer"></label>
                </div>
                {file && (
                  <div className="flex items-center text-green-600 text-sm mt-2">
                    <CheckCircle2 className="h-4 w-4 mr-1" /> {file.name}
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full h-11" disabled={!file}>
                Upload Report
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
