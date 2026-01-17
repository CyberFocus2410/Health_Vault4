import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, FileText, Bell, Brain, ChevronRight, Lock, User as UserIcon, Clock, ShieldAlert, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const VitalsChart = ({ data }: { data: any[] }) => (
  <div className="h-[300px] w-full mt-4">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
        <XAxis dataKey="date" tick={{fontSize: 12, fill: '#64748B'}} tickLine={false} axisLine={false} />
        <YAxis tick={{fontSize: 12, fill: '#64748B'}} tickLine={false} axisLine={false} />
        <Tooltip 
          contentStyle={{backgroundColor: 'white', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
        />
        <Line type="monotone" dataKey="bpSystolic" stroke="hsl(170 70% 40%)" strokeWidth={2} dot={{r: 4}} name="BP (Sys)" />
        <Line type="monotone" dataKey="bpDiastolic" stroke="hsl(190 60% 50%)" strokeWidth={2} dot={{r: 4}} name="BP (Dia)" />
        <Line type="monotone" dataKey="sugarFasting" stroke="hsl(340 60% 70%)" strokeWidth={2} dot={{r: 4}} name="Sugar (F)" />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

const ReminderSection = () => {
  const { reminders, addReminder } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [newRem, setNewRem] = useState({ type: "medicine" as any, title: "", time: "", date: "" });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5" /> Reminders</CardTitle>
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogTrigger asChild>
            <Button size="sm">Add New</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Set Health Reminder</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Reminder Type</Label>
                <Select onValueChange={(v) => setNewRem({...newRem, type: v as any})} defaultValue="medicine">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="medicine">Medicine</SelectItem>
                    <SelectItem value="appointment">Doctor Appointment</SelectItem>
                    <SelectItem value="vitals">Log Vitals</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input placeholder="e.g. Morning Insulin" value={newRem.title} onChange={(e) => setNewRem({...newRem, title: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Time</Label>
                  <Input type="time" value={newRem.time} onChange={(e) => setNewRem({...newRem, time: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Date (Optional)</Label>
                  <Input type="date" value={newRem.date} onChange={(e) => setNewRem({...newRem, date: e.target.value})} />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => { addReminder(newRem); setShowAdd(false); toast({title: "Reminder Set"}); }}>Save Reminder</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px]">
          {reminders.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No active reminders</p>
          ) : (
            <div className="space-y-3">
              {reminders.map(rem => (
                <div key={rem.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${rem.type === 'medicine' ? 'bg-blue-100 text-blue-600' : rem.type === 'appointment' ? 'bg-purple-100 text-purple-600' : 'bg-orange-100 text-orange-600'}`}>
                      {rem.type === 'medicine' ? <Activity className="h-4 w-4" /> : rem.type === 'appointment' ? <UserIcon className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{rem.title}</p>
                      <p className="text-xs text-muted-foreground">{rem.time} {rem.date ? `on ${rem.date}` : 'Daily'}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="capitalize">{rem.type}</Badge>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

const EmergencyProfileSection = () => {
  const { emergencyProfile, updateEmergencyProfile } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(emergencyProfile);

  return (
    <Card className="border-red-100 bg-red-50/30">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-red-700"><ShieldAlert className="h-5 w-5" /> Emergency Profile</CardTitle>
        <Button variant="ghost" size="sm" onClick={() => setIsEditing(!isEditing)}>{isEditing ? "Cancel" : "Edit Profile"}</Button>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Blood Group</Label>
                <Input value={profile.bloodGroup} onChange={e => setProfile({...profile, bloodGroup: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Emergency Contact</Label>
                <Input value={profile.emergencyContact} onChange={e => setProfile({...profile, emergencyContact: e.target.value})} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Allergies</Label>
              <Input value={profile.allergies} onChange={e => setProfile({...profile, allergies: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Chronic Conditions</Label>
              <Input value={profile.healthProblems} onChange={e => setProfile({...profile, healthProblems: e.target.value})} />
            </div>
            <Button className="w-full bg-red-600 hover:bg-red-700" onClick={() => { updateEmergencyProfile(profile); setIsEditing(false); toast({title: "Profile Updated"}); }}>Save Emergency Profile</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground font-medium">Blood Group</p>
              <p className="font-bold text-lg text-red-900">{emergencyProfile.bloodGroup}</p>
            </div>
            <div>
              <p className="text-muted-foreground font-medium">Emergency Contact</p>
              <p className="font-bold">{emergencyProfile.emergencyContact}</p>
            </div>
            <div className="md:col-span-2 border-t pt-2 mt-2">
              <p className="text-muted-foreground font-medium">Allergies & Medical History</p>
              <p className="text-slate-700">{emergencyProfile.allergies} | {emergencyProfile.healthProblems}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const ShareRecordDialog = ({ recordId, type }: { recordId: string, type: "report" | "vitals" }) => {
  const { shareRecord } = useApp();
  const [open, setOpen] = useState(false);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-primary"><Share2 className="h-4 w-4" /></Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Share with Doctor</DialogTitle></DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">Select a doctor to securely share this {type} for review.</p>
          <div className="space-y-2">
             <Label>Select Doctor</Label>
             <Select defaultValue="d1">
               <SelectTrigger><SelectValue /></SelectTrigger>
               <SelectContent>
                 <SelectItem value="d1">Dr. Anjali Gupta (MD, Cardiology)</SelectItem>
                 <SelectItem value="d2">Dr. Vikram Singh (MD, General)</SelectItem>
               </SelectContent>
             </Select>
          </div>
        </div>
        <DialogFooter>
          <Button className="w-full" onClick={() => {
            shareRecord({ patientId: "p1", doctorId: "d1", recordId, type });
            setOpen(false);
            toast({ title: "Shared Successfully", description: "The doctor will be notified to review this record." });
          }}>Confirm Sharing</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const AIHealthSummary = () => {
  const { generateHealthOverview } = useApp();
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const result = await generateHealthOverview();
    setSummary(result);
    setLoading(false);
  };

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-primary" />
          <CardTitle className="text-primary">AI Health Insights (Gemini 3)</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {!summary ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">Generate a comprehensive analysis of your health trends using Google Gemini.</p>
            <Button onClick={handleGenerate} disabled={loading} className="w-full sm:w-auto">
              {loading ? "Analyzing Records..." : "Generate Monthly Summary"}
            </Button>
          </div>
        ) : (
          <div className="prose prose-sm max-w-none text-slate-700 bg-white/50 p-4 rounded-lg">
             <div className="whitespace-pre-line">{summary}</div>
             <Button variant="ghost" size="sm" onClick={() => setSummary(null)} className="mt-4 text-xs">Close Analysis</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function PatientDashboard() {
  const { vitals, reports, accessRequests, updateAccessStatus, logout, currentUser } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Mobile Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-border p-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-white">
            <ShieldCheckIcon className="h-5 w-5" />
          </div>
          <span className="font-heading font-bold text-lg">MediVault</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
             <Bell className="h-5 w-5 text-muted-foreground" />
             {accessRequests.filter(r => r.status === "pending").length > 0 && (
               <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border border-white"></span>
             )}
          </div>
          <Button variant="ghost" size="icon" onClick={logout}>
            <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center">
              <span className="text-xs font-bold text-slate-600">RS</span>
            </div>
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-heading font-bold text-slate-900">Hello, {currentUser?.name}</h1>
            <p className="text-muted-foreground">ABHA ID: {currentUser?.abhaId}</p>
          </div>
          <div className="flex gap-2">
             <Dialog>
               <DialogTrigger asChild>
                 <Button variant="outline"><Activity className="mr-2 h-4 w-4" /> Log Vitals</Button>
               </DialogTrigger>
               <DialogContent>
                 <DialogHeader><DialogTitle>Record Vitals</DialogTitle></DialogHeader>
                 {/* Mock Form */}
                 <div className="grid grid-cols-2 gap-4 py-4">
                    <input className="border p-2 rounded" placeholder="SpO2 %" />
                    <input className="border p-2 rounded" placeholder="BP Sys" />
                    <input className="border p-2 rounded" placeholder="BP Dia" />
                    <input className="border p-2 rounded" placeholder="Weight (kg)" />
                 </div>
                 <Button className="w-full">Save Record</Button>
               </DialogContent>
             </Dialog>
          </div>
        </div>

        {/* Emergency Profile (New) */}
        <EmergencyProfileSection />

        {/* Reminders (New) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <AIHealthSummary />
          </div>
          <div>
            <ReminderSection />
          </div>
        </div>

        {/* Pending Requests */}
        {accessRequests.filter(r => r.status === "pending").length > 0 && (
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-orange-800 text-base flex items-center">
                <Lock className="mr-2 h-4 w-4" /> Consent Request
              </CardTitle>
            </CardHeader>
            <CardContent>
              {accessRequests.filter(r => r.status === "pending").map(req => (
                <div key={req.id} className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium">{req.doctorName} requests access</span>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="default" className="bg-orange-600 hover:bg-orange-700 text-white" onClick={() => updateAccessStatus(req.id, "approved")}>Approve</Button>
                    <Button size="sm" variant="outline" className="bg-white" onClick={() => updateAccessStatus(req.id, "denied")}>Deny</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Tabs for different views */}
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
             <Card>
               <CardHeader className="flex flex-row items-center justify-between">
                 <div>
                   <CardTitle>Vitals Trend</CardTitle>
                   <CardDescription>Last 6 months of tracked health data</CardDescription>
                 </div>
                 <ShareRecordDialog recordId="latest-vitals" type="vitals" />
               </CardHeader>
               <CardContent>
                 <VitalsChart data={vitals} />
               </CardContent>
             </Card>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <Card>
                 <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Blood Pressure (Latest)</CardTitle>
                 </CardHeader>
                 <CardContent>
                   <div className="text-2xl font-bold">120/80 <span className="text-sm font-normal text-muted-foreground">mmHg</span></div>
                   <p className="text-xs text-green-600 mt-1 flex items-center">Stable since last month</p>
                 </CardContent>
               </Card>
               <Card>
                 <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Weight (Latest)</CardTitle>
                 </CardHeader>
                 <CardContent>
                   <div className="text-2xl font-bold">72.5 <span className="text-sm font-normal text-muted-foreground">kg</span></div>
                   <p className="text-xs text-muted-foreground mt-1">Last updated 2 days ago</p>
                 </CardContent>
               </Card>
             </div>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-4 mt-4">
            <Card>
              <CardHeader><CardTitle>Health Timeline</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                {reports.map((report) => (
                  <div key={report.id} className="flex gap-4 relative">
                    {/* Line connecting items */}
                    <div className="absolute left-2.5 top-8 bottom-[-24px] w-px bg-slate-200 last:hidden"></div>
                    
                    <div className="h-5 w-5 rounded-full bg-primary/20 border-2 border-primary z-10 flex-shrink-0 mt-1"></div>
                    <div className="flex-1 pb-6">
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-slate-900">{report.title}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">{report.date}</span>
                          <ShareRecordDialog recordId={report.id} type="report" />
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 mt-1">{report.summary}</p>
                      <Badge variant="secondary" className="mt-2 text-xs">{report.uploadedBy}</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="mt-4">
            <div className="grid gap-4">
              {reports.map(report => (
                 <Card key={report.id} className="hover:shadow-md transition-shadow">
                   <CardContent className="p-4 flex justify-between items-center">
                     <div className="flex items-center gap-3">
                       <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                         <FileText className="h-5 w-5" />
                       </div>
                       <div>
                         <p className="font-medium">{report.title}</p>
                         <p className="text-xs text-muted-foreground">{report.date} • {report.type.toUpperCase()}</p>
                       </div>
                     </div>
                     <div className="flex items-center gap-2">
                        <ShareRecordDialog recordId={report.id} type="report" />
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                     </div>
                   </CardContent>
                 </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <Card className="bg-slate-900 text-white mt-8">
          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-2">Future Scope</h3>
            <p className="text-sm text-slate-300">
              This prototype demonstrates the potential of ABDM-compliant health records. 
              Future versions will include real-time integration with hospital HMIS, 
              blockchain-based immutable consent logs, and localized language support for rural adoption.
            </p>
          </CardContent>
        </Card>

      </main>
    </div>
  );
}

function ShieldCheckIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
