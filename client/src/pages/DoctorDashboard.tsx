import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, UserPlus, FileText, Activity, MessageSquare, ShieldAlert, CheckCircle2, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

export default function DoctorDashboard() {
  const { accessRequests, requestAccess, logout, currentUser, sharedRecords, reports, addDoctorComment, emergencyProfile } = useApp();
  const [searchId, setSearchId] = useState("");
  const { toast } = useToast();
  const [viewingPatient, setViewingPatient] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState("overview");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchId === "1234-5678-9012") { // Mock Patient ID
       // Check if already has access
       const existingRequest = accessRequests.find(r => r.patientId === "p1" && r.doctorId === currentUser?.id);
       
       if (existingRequest?.status === "approved") {
         setViewingPatient(true);
       } else if (existingRequest?.status === "pending") {
         toast({ title: "Request Pending", description: "You have already requested access. Waiting for patient approval." });
       } else {
         toast({ title: "Patient Found", description: "Please request access to view records." });
       }
    } else {
      toast({ variant: "destructive", title: "Patient Not Found", description: "Invalid ABHA ID." });
    }
  };

  const handleRequestAccess = () => {
    requestAccess("p1");
    toast({ title: "Request Sent", description: "Access request sent to patient mobile app." });
  };

  if (viewingPatient) {
    const patientShared = sharedRecords.filter(s => s.patientId === "p1" && s.doctorId === currentUser?.id);

    return (
      <div className="min-h-screen bg-slate-50">
        <header className="bg-white border-b p-4 flex justify-between items-center sticky top-0 z-10">
           <Button variant="ghost" onClick={() => setViewingPatient(false)}>← Back to Search</Button>
           <div className="text-center">
             <h1 className="font-bold text-lg">Rahul Sharma</h1>
             <p className="text-xs text-muted-foreground">ABHA: 1234-5678-9012</p>
           </div>
           <div className="flex gap-2">
              <Badge className="bg-red-50 text-red-700 border-red-200">Bld: {emergencyProfile.bloodGroup}</Badge>
           </div>
        </header>

        <main className="p-6 max-w-5xl mx-auto space-y-6">
           <Tabs defaultValue="overview" onValueChange={setActiveTab}>
             <TabsList className="grid w-full grid-cols-3 mb-6">
               <TabsTrigger value="overview">Clinical Overview</TabsTrigger>
               <TabsTrigger value="shared">Shared Records ({patientShared.length})</TabsTrigger>
               <TabsTrigger value="emergency">Emergency Info</TabsTrigger>
             </TabsList>

             <TabsContent value="overview" className="space-y-6">
               <Card className="border-l-4 border-l-primary shadow-sm">
                 <CardHeader>
                   <CardTitle className="text-lg">AI Patient Overview</CardTitle>
                   <CardDescription>Synthesized from historical longitudinal data</CardDescription>
                 </CardHeader>
                 <CardContent>
                   <p className="text-slate-700 leading-relaxed text-sm">
                     The patient, Rahul Sharma (Male, 34), has a history of mild hypertension, stable over the last 4 years. 
                     Recent reports indicate a slight elevation in cholesterol levels (LDL 130 mg/dL), which is a new development compared to previous stable lipid profiles.
                     No significant allergies reported besides Penicillin.
                   </p>
                 </CardContent>
               </Card>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Card>
                   <CardHeader><CardTitle className="text-base">Latest Vitals</CardTitle></CardHeader>
                   <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between border-b pb-2">
                          <span className="text-muted-foreground">Blood Pressure</span>
                          <span className="font-medium">120/80</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                          <span className="text-muted-foreground">SpO2</span>
                          <span className="font-medium">98%</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                          <span className="text-muted-foreground">Weight</span>
                          <span className="font-medium">72.5 kg</span>
                        </div>
                      </div>
                   </CardContent>
                 </Card>

                 <Card>
                   <CardHeader><CardTitle className="text-base">History Brief</CardTitle></CardHeader>
                   <CardContent>
                     <ul className="space-y-3">
                       <li className="flex justify-between items-center p-2 bg-slate-50 rounded text-sm">
                         <span className="font-medium">Lipid Profile</span>
                         <span className="text-xs text-muted-foreground text-right">Borderline High<br/>Jan 10, 2026</span>
                       </li>
                       <li className="flex justify-between items-center p-2 bg-slate-50 rounded text-sm">
                         <span className="font-medium">Chest X-Ray</span>
                         <span className="text-xs text-muted-foreground text-right">Normal<br/>Nov 20, 2025</span>
                       </li>
                     </ul>
                   </CardContent>
                 </Card>
               </div>
             </TabsContent>

             <TabsContent value="shared" className="space-y-4">
               {patientShared.length === 0 ? (
                 <div className="text-center py-12 bg-white rounded-lg border border-dashed">
                   <p className="text-muted-foreground">No records explicitly shared for review yet.</p>
                 </div>
               ) : (
                 <div className="grid gap-4">
                   {patientShared.map(share => {
                     const report = reports.find(r => r.id === share.recordId);
                     return (
                       <Card key={share.id}>
                         <CardHeader className="pb-2">
                           <div className="flex justify-between items-start">
                             <div>
                               <CardTitle className="text-base">{share.type === 'report' ? report?.title : 'Vitals History'}</CardTitle>
                               <CardDescription>Shared on {new Date(share.sharedAt).toLocaleDateString()}</CardDescription>
                             </div>
                             <Badge variant="secondary" className="capitalize">{share.type}</Badge>
                           </div>
                         </CardHeader>
                         <CardContent className="space-y-4">
                           <div className="p-3 bg-slate-50 rounded-md text-sm italic text-slate-600">
                             Patient is requesting a review of this {share.type}.
                           </div>
                           
                           <div className="space-y-2">
                             <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Doctor's Observation</Label>
                             {share.doctorComment ? (
                               <div className="p-3 bg-blue-50 text-blue-800 rounded-md text-sm border border-blue-100 flex gap-2">
                                 <CheckCircle2 className="h-4 w-4 mt-0.5" />
                                 {share.doctorComment}
                               </div>
                             ) : (
                               <div className="flex gap-2">
                                 <Textarea placeholder="Add your clinical notes or next steps..." id={`comment-${share.id}`} />
                                 <Button size="sm" onClick={() => {
                                   const el = document.getElementById(`comment-${share.id}`) as HTMLTextAreaElement;
                                   addDoctorComment(share.id, el.value);
                                   toast({title: "Observation Saved", description: "Patient will see your comments in their timeline."});
                                 }}>Post</Button>
                               </div>
                             )}
                           </div>
                         </CardContent>
                       </Card>
                     );
                   })}
                 </div>
               )}
             </TabsContent>

             <TabsContent value="emergency">
                <Card className="border-red-200 bg-red-50/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-800"><ShieldAlert className="h-5 w-5" /> Emergency Profile Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="p-4 bg-white rounded-lg border shadow-sm">
                        <Label className="text-slate-500 text-xs font-bold">BLOOD GROUP</Label>
                        <p className="text-2xl font-black text-red-600">{emergencyProfile.bloodGroup}</p>
                      </div>
                      <div className="p-4 bg-white rounded-lg border shadow-sm">
                        <Label className="text-slate-500 text-xs font-bold">EMERGENCY CONTACT</Label>
                        <p className="font-bold">{emergencyProfile.emergencyContact}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-500 text-xs font-bold">ALLERGIES</Label>
                      <div className="p-3 bg-white rounded-lg border text-sm font-semibold text-red-700">{emergencyProfile.allergies}</div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-500 text-xs font-bold">CURRENT MEDICATIONS</Label>
                      <div className="p-3 bg-white rounded-lg border text-sm">{emergencyProfile.medications}</div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-500 text-xs font-bold">HEALTH PROBLEMS</Label>
                      <div className="p-3 bg-white rounded-lg border text-sm">{emergencyProfile.healthProblems}</div>
                    </div>
                  </CardContent>
                </Card>
             </TabsContent>
           </Tabs>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b p-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center space-x-2">
           <div className="h-8 w-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">Dr</div>
           <span className="font-heading font-bold">MediVault MD</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative cursor-pointer">
            <MessageSquare className="h-5 w-5 text-slate-400" />
            {sharedRecords.filter(s => s.doctorId === currentUser?.id && !s.doctorComment).length > 0 && (
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-blue-500 rounded-full border border-white"></span>
            )}
          </div>
          <Button variant="ghost" onClick={logout}>Logout</Button>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-2xl mx-auto w-full flex flex-col justify-center">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">Find a Patient</h1>
          <p className="text-muted-foreground">Enter ABHA ID to request access to records</p>
        </div>

        <Card className="shadow-lg border-none">
          <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input 
                placeholder="Enter ABHA ID (e.g. 1234-5678-9012)" 
                className="text-lg h-12"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
              />
              <Button type="submit" size="lg" className="px-8 bg-blue-600 hover:bg-blue-700">
                <Search className="h-5 w-5" />
              </Button>
            </form>

            {searchId === "1234-5678-9012" && (
              <div className="mt-6 p-4 border rounded-lg bg-blue-50 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <UserPlus className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Rahul Sharma</p>
                    <p className="text-xs text-slate-500">Male, 34 Years</p>
                  </div>
                </div>
                {accessRequests.find(r => r.patientId === "p1" && r.doctorId === currentUser?.id) ? (
                  <Button variant="outline" className="border-blue-200 text-blue-600" onClick={() => setViewingPatient(true)}>Enter Vault</Button>
                ) : (
                  <Button onClick={handleRequestAccess}>Request Access</Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {sharedRecords.filter(s => s.doctorId === currentUser?.id && !s.doctorComment).length > 0 && (
          <div className="mt-8 space-y-3">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Recent Patient Shares</p>
            {sharedRecords.filter(s => s.doctorId === currentUser?.id && !s.doctorComment).map(share => (
              <div key={share.id} className="p-3 bg-white rounded-lg border flex justify-between items-center shadow-sm cursor-pointer hover:border-blue-300 transition-colors" onClick={() => { setSearchId("1234-5678-9012"); setViewingPatient(true); }}>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-slate-100 rounded flex items-center justify-center text-slate-500">
                    <Share2 className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">Rahul Sharma shared a {share.type}</span>
                </div>
                <Badge variant="outline">New Review</Badge>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
