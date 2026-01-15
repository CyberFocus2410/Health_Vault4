import React, { useState } from "react";
import { useApp, UserRole } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldCheck, Stethoscope, Microscope, User } from "lucide-react";
import { useLocation } from "wouter";

export default function AuthPage() {
  const { login } = useApp();
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);

  const handleLogin = (role: UserRole) => {
    setLoading(true);
    // Simulate network request
    setTimeout(() => {
      login(role);
      setLoading(false);
      setLocation(role === "doctor" ? "/doctor" : role === "lab" ? "/lab" : "/patient");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg">
              <ShieldCheck className="h-8 w-8" />
            </div>
          </div>
          <h1 className="text-3xl font-heading font-bold text-slate-900">MediVault AI</h1>
          <p className="text-muted-foreground">Secure Health Records & AI Insights</p>
        </div>

        <Card className="border-none shadow-xl">
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>Select your role to login to the prototype</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="patient" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="patient">Patient</TabsTrigger>
                <TabsTrigger value="doctor">Doctor</TabsTrigger>
                <TabsTrigger value="lab">Lab</TabsTrigger>
              </TabsList>

              <TabsContent value="patient" className="space-y-4">
                <div className="space-y-2">
                  <Label>ABHA / Mobile Number</Label>
                  <Input placeholder="Enter mock ID (e.g., 1234...)" />
                </div>
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input type="password" value="password" readOnly className="bg-slate-50" />
                </div>
                <Button className="w-full h-11" onClick={() => handleLogin("patient")} disabled={loading}>
                  {loading ? "Verifying..." : "Login as Patient"}
                </Button>
              </TabsContent>

              <TabsContent value="doctor" className="space-y-4">
                <div className="space-y-2">
                  <Label>Medical License ID</Label>
                  <Input placeholder="MD-12345" />
                </div>
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input type="password" value="password" readOnly className="bg-slate-50" />
                </div>
                <Button className="w-full h-11" variant="outline" onClick={() => handleLogin("doctor")} disabled={loading}>
                  <Stethoscope className="mr-2 h-4 w-4" />
                  {loading ? "Verifying..." : "Login as Doctor"}
                </Button>
              </TabsContent>

              <TabsContent value="lab" className="space-y-4">
                <div className="space-y-2">
                  <Label>Lab License ID</Label>
                  <Input placeholder="LAB-9988" />
                </div>
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input type="password" value="password" readOnly className="bg-slate-50" />
                </div>
                <Button className="w-full h-11" variant="secondary" onClick={() => handleLogin("lab")} disabled={loading}>
                  <Microscope className="mr-2 h-4 w-4" />
                  {loading ? "Verifying..." : "Login as Lab Partner"}
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <p className="text-center text-xs text-muted-foreground">
          Prototype Mode: No real authentication required.
        </p>
      </div>
    </div>
  );
}
