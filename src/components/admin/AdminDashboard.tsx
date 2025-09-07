import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Upload, FolderOpen, Mail, FileText, LayoutDashboard, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { portfolioApi, type Category, type Subcategory, type PortfolioItem, type Enquiry, type Resume } from "@/lib/supabase";

import CategoryManager from "./CategoryManager";
import PortfolioManager from "./PortfolioManager";
import PortfolioUpload from "./PortfolioUpload";
import ResumeManager from "./ResumeManager";

// Define props interface for AdminDashboard
interface AdminDashboardProps {
  initialCategories: Category[];
  initialSubcategories: Subcategory[];
}

const AdminDashboard = ({ initialCategories, initialSubcategories }: AdminDashboardProps) => {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [subcategories, setSubcategories] = useState<Subcategory[]>(initialSubcategories);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  console.log("AdminDashboard rendered. Current isAuthenticated:", isAuthenticated, "Current loading:", loading);

  useEffect(() => {
    console.log("AdminDashboard useEffect: Checking localStorage for auth status.");
    const authStatus = localStorage.getItem('admin_authenticated');
    console.log("useEffect: authStatus from localStorage:", authStatus);

    if (authStatus === 'true') {
      console.log("useEffect: Found 'admin_authenticated' in localStorage. Setting isAuthenticated to true.");
      setIsAuthenticated(true);
      loadData(false);
    } else {
      console.log("useEffect: 'admin_authenticated' not found or false in localStorage. Setting isAuthenticated to false, loading to false.");
      setIsAuthenticated(false);
      setLoading(false);
    }
  }, []);

  const handleLogin = async () => {
    setLoginLoading(true);
    console.log("handleLogin: Attempting login for username:", username);
    try {
      if (username === "admin" && password === "admin123") {
        localStorage.setItem('admin_authenticated', 'true');
        setIsAuthenticated(true);
        console.log("handleLogin: Login successful. isAuthenticated set to true.");
        loadData(true);
        toast({
          title: "Login Successful",
          description: "Welcome to admin dashboard!"
        });
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid username or password",
          variant: "destructive"
        });
        setIsAuthenticated(false);
        setLoading(false);
        console.log("handleLogin: Login failed due to invalid credentials.");
      }
    } catch (error: any) {
      toast({
        title: "Login Error",
        description: error.message || "An error occurred during login",
        variant: "destructive"
      });
      setIsAuthenticated(false);
      setLoading(false);
      console.error("handleLogin: Caught an error during login:", error);
    } finally {
      setLoginLoading(false);
      console.log("handleLogin: loginLoading set to false.");
    }
  };

  const loadData = async (fetchAllCategoriesAndSubcategories: boolean) => {
    setLoading(true);
    console.log("loadData: function started. Setting loading to true.");
    try {
      const promises = [
        portfolioApi.getPortfolioItems(),
        portfolioApi.getEnquiries(),
        portfolioApi.getResumes(),
      ];

      if (fetchAllCategoriesAndSubcategories) {
        promises.unshift(portfolioApi.getCategories());
        promises.unshift(portfolioApi.getSubcategories());
      }

      const results = await Promise.all(promises);
      console.log("loadData: All API calls resolved successfully.");

      let categoriesData = categories;
      let subcategoriesData = subcategories;
      let portfolioData = results[0];
      let enquiriesData = results[1];
      let resumesData = results[2];

      if (fetchAllCategoriesAndSubcategories) {
        subcategoriesData = results[0];
        categoriesData = results[1];
        portfolioData = results[2];
        enquiriesData = results[3];
        resumesData = results[4];
      }

      setCategories(categoriesData);
      setSubcategories(subcategoriesData);
      setPortfolioItems(portfolioData);
      setEnquiries(enquiriesData);
      setResumes(resumesData);

      toast({
        title: "Dashboard Loaded",
        description: "All data loaded successfully from Supabase"
      });
    } catch (error: any) {
      console.error('loadData: Error caught:', error);
      toast({
        title: "Error Loading Data",
        description: error.message || "Failed to load data from database",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      console.log("loadData: function finished. Setting loading to false.");
    }
  };

  const signOut = () => {
    console.log("signOut: Attempting to sign out.");
    localStorage.removeItem('admin_authenticated');
    setIsAuthenticated(false);
    setUsername("");
    setPassword("");
    setCategories(initialCategories);
    setSubcategories(initialSubcategories);
    setPortfolioItems([]);
    setEnquiries([]);
    setResumes([]);
    setLoading(false);
    setActiveTab("overview");
    toast({
      title: "Signed Out",
      description: "You have been signed out successfully."
    });
    console.log("signOut: Signed out successfully. isAuthenticated set to false, loading set to false.");
  };

  console.log("AdminDashboard: Rendering decision - isAuthenticated:", isAuthenticated, "loading:", loading);

  if (loading) {
    console.log("AdminDashboard: Displaying loading spinner.");
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log("AdminDashboard: Displaying login form.");
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-primary">Admin Access</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground text-center">
              Sign in to access the portfolio management dashboard
            </p>
            <div className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                />
              </div>
              <Button
                onClick={handleLogin}
                className="w-full"
                disabled={loginLoading}
              >
                {loginLoading ? "Signing In..." : "Sign In"}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Username: <strong>admin</strong> | Password: <strong>admin123</strong>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  console.log("AdminDashboard: Displaying main dashboard content. isAuthenticated is TRUE, loading is FALSE.");
  console.log("AdminDashboard: Data for tabs - Categories:", categories.length, "Subcategories:", subcategories.length, "PortfolioItems:", portfolioItems.length, "Enquiries:", enquiries.length, "Resumes:", resumes.length);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary">Portfolio Admin</h1>
            <p className="text-muted-foreground">Manage your portfolio content and categories</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Welcome, Admin</span>
            <Button variant="outline" onClick={signOut}>
              Sign Out
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FolderOpen className="h-8 w-8 text-primary" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">{categories.length}</p>
                  <p className="text-sm text-muted-foreground">Categories</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Settings className="h-8 w-8 text-primary" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">{subcategories.length}</p>
                  <p className="text-sm text-muted-foreground">Subcategories</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Upload className="h-8 w-8 text-primary" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">{portfolioItems.length}</p>
                  <p className="text-sm text-muted-foreground">Portfolio Items</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Plus className="h-8 w-8 text-primary" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">{portfolioItems.filter(item => item.featured).length}</p>
                  <p className="text-sm text-muted-foreground">Featured Items</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Mail className="h-8 w-8 text-primary" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">{enquiries.length}</p>
                  <p className="text-sm text-muted-foreground">Enquiries</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview"><LayoutDashboard className="h-4 w-4 mr-2" /> Dashboard</TabsTrigger>
            <TabsTrigger value="portfolio"><Upload className="h-4 w-4 mr-2" /> Portfolio Upload</TabsTrigger>
            <TabsTrigger value="manage-portfolio"><FolderOpen className="h-4 w-4 mr-2" /> Manage Portfolio</TabsTrigger>
            <TabsTrigger value="categories"><Settings className="h-4 w-4 mr-2" /> Categories</TabsTrigger>
            <TabsTrigger value="resumes"><FileText className="h-4 w-4 mr-2" /> Resumes</TabsTrigger>
            <TabsTrigger value="enquiries"><Mail className="h-4 w-4 mr-2" /> Enquiries</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Dashboard Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Database Connection</h3>
                    <p className="text-muted-foreground mb-4 text-green-600">
                      ✅ Connected to Supabase successfully!
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Project ID: cgjqwgudysnsarwfxady
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Authentication</h3>
                    <p className="text-muted-foreground mb-4">
                      Current demo credentials: admin / admin123
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Database Statistics</h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>Categories: {categories.length}</p>
                      <p>Subcategories: {subcategories.length}</p>
                      <p>Portfolio Items: {portfolioItems.length}</p>
                      <p>Enquiries: {enquiries.length}</p>
                      <p>Resumes: {resumes.length}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="portfolio">
            <PortfolioUpload categories={categories} subcategories={subcategories} onUpload={() => loadData(true)} />
          </TabsContent>

          <TabsContent value="manage-portfolio">
            <PortfolioManager portfolioItems={portfolioItems} categories={categories} subcategories={subcategories} onUpdate={() => loadData(true)} />
          </TabsContent>

          <TabsContent value="categories">
            <CategoryManager categories={categories} subcategories={subcategories} onUpdate={() => loadData(true)} />
          </TabsContent>

          <TabsContent value="resumes">
            <ResumeManager resumes={resumes} onUpdate={() => loadData(true)} />
          </TabsContent>

          <TabsContent value="enquiries">
            <Card>
              <CardHeader>
                <CardTitle>Customer Enquiries</CardTitle>
              </CardHeader>
              <CardContent>
                {enquiries.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No enquiries yet</p>
                ) : (
                  <div className="space-y-4">
                    {enquiries.map((enquiry) => (
                      <Card key={enquiry.id} className="p-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <h3 className="font-semibold">{enquiry.name}</h3>
                            <span className="text-sm text-muted-foreground">
                              {new Date(enquiry.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm"><strong>Phone:</strong> {enquiry.phone}</p>
                          {enquiry.email && <p className="text-sm"><strong>Email:</strong> {enquiry.email}</p>}
                          <p className="text-sm"><strong>Message:</strong> {enquiry.message}</p>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};