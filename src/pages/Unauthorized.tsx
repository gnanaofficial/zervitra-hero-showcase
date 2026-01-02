import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShieldX } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Unauthorized = () => {
  const navigate = useNavigate();
  const { role, user, managerId } = useAuth();

  const handleGoToDashboard = () => {
    // Security check: Only redirect if user is actually authenticated
    if (!user) {
      // If not authenticated, redirect to login
      navigate("/login");
      return;
    }

    // Verify user has a valid role
    if (!role) {
      // If no role assigned, redirect to login
      navigate("/login");
      return;
    }

    // Redirect based on role
    if (role === "admin") {
      navigate("/admin/dashboard");
    } else if (role === "manager" && managerId) {
      navigate("/manager/dashboard");
    } else if (role === "user") {
      navigate("/client/dashboard");
    } else {
      // If role exists but something is wrong, go to login
      navigate("/login");
    }
  };

  return (
    <>
      <Helmet>
        <title>Access Denied - Zervitra</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
            <ShieldX className="w-10 h-10 text-destructive" />
          </div>

          <h1 className="text-4xl font-bold text-foreground mb-4">
            Access Denied
          </h1>

          <p className="text-lg text-muted-foreground mb-8">
            You don't have permission to access this page. Please contact your
            administrator if you believe this is an error.
          </p>

          <div className="flex gap-4 justify-center">
            <Button onClick={handleGoToDashboard} size="lg">
              Go to Dashboard
            </Button>
            <Button onClick={() => navigate("/")} variant="outline" size="lg">
              Go Home
            </Button>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Unauthorized;
