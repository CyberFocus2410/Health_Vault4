import { Switch, Route, useLocation } from "wouter";
import { AppProvider, useApp } from "@/context/AppContext";
import AuthPage from "@/pages/AuthPage";
import PatientDashboard from "@/pages/PatientDashboard";
import DoctorDashboard from "@/pages/DoctorDashboard";
import LabDashboard from "@/pages/LabDashboard";
import NotFound from "@/pages/not-found";
import { Toaster } from "@/components/ui/toaster";
import { useEffect } from "react";

function ProtectedRoute({ component: Component, allowedRole }: any) {
  const { currentUser } = useApp();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!currentUser) {
      setLocation("/");
    } else if (allowedRole && currentUser.role !== allowedRole) {
       // Redirect based on actual role
       if(currentUser.role === 'patient') setLocation('/patient');
       else if(currentUser.role === 'doctor') setLocation('/doctor');
       else if(currentUser.role === 'lab') setLocation('/lab');
    }
  }, [currentUser, setLocation, allowedRole]);

  if (!currentUser) return null;
  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={AuthPage} />
      <Route path="/patient">
        <ProtectedRoute component={PatientDashboard} allowedRole="patient" />
      </Route>
      <Route path="/doctor">
        <ProtectedRoute component={DoctorDashboard} allowedRole="doctor" />
      </Route>
      <Route path="/lab">
        <ProtectedRoute component={LabDashboard} allowedRole="lab" />
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <AppProvider>
      <Router />
      <Toaster />
    </AppProvider>
  );
}

export default App;
