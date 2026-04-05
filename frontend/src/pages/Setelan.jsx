import { useState, useEffect } from "react";
import { Menu, Save, ShieldCheck, Activity, User as UserIcon, Lock, Globe, CheckCircle2, XCircle, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SidebarContent from "@/component/SidebarContent";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/component/ui/card";
import { Input } from "@/component/ui/input";
import { Label } from "@/component/ui/label";
import { Button } from "@/component/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/component/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/component/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";

export default function Setelan() {
  const { user, logout, updateProfile, updatePassword } = useAuth();
  const navigate = useNavigate();

  // Profile Form States
  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: "", text: "" });

  // Password Form States
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState({ type: "", text: "" });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // System Environment States
  const [apiStatus, setApiStatus] = useState("checking"); // checking, ok, error
  
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setBusinessName(user.businessName || "");
      setPhoneNumber(user.phoneNumber || "");
    }
  }, [user]);

  useEffect(() => {
    // Check API Status
    const checkApi = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
        await axios.get(`${API_URL}/api/health`);
        setApiStatus("ok");
      } catch {
        setApiStatus("error");
      }
    };
    checkApi();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const displayName = user?.businessName || user?.fullName || "Nama Toko";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsProfileLoading(true);
    setProfileMsg({ type: "", text: "" });
    try {
      await updateProfile({ fullName, businessName, phoneNumber });
      setProfileMsg({ type: "success", text: "Profil berhasil diperbarui!" });
    } catch (error) {
      setProfileMsg({ type: "error", text: error.message || "Gagal memperbarui profil" });
    } finally {
      setIsProfileLoading(false);
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    setPasswordMsg({ type: "", text: "" });

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: "error", text: "Konfirmasi password baru tidak cocok." });
      return;
    }
    if (newPassword.length < 8) {
      setPasswordMsg({ type: "error", text: "Password minimal 8 karakter." });
      return;
    }
    
    setIsPasswordLoading(true);
    try {
      await updatePassword(oldPassword, newPassword);
      setPasswordMsg({ type: "success", text: "Password berhasil diperbarui!" });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setPasswordMsg({ type: "error", text: error.message || "Gagal memperbarui password" });
    } finally {
      setIsPasswordLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fffcf5] text-[#102e4a]">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 flex-col bg-[#102e4a] text-white md:flex">
          <SidebarContent
            displayName={displayName}
            initials={initials}
            onLogout={handleLogout}
          />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-[#f1f5f9] bg-[#fffcf5]/80 px-5 py-4 backdrop-blur md:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="hidden flex-col gap-1 md:flex">
                <div className="text-xs font-semibold text-[#64748b]">
                  DashUMKM / <span className="text-[#3182ce]">Setelan</span>
                </div>
                <h1 className="text-2xl font-semibold text-[#0f172a]">
                  Setelan
                </h1>
              </div>

              <div className="flex items-center gap-3 md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <button
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e2e8f0] bg-white text-[#64748b]"
                      aria-label="Buka menu"
                    >
                      <Menu className="h-4 w-4" />
                    </button>
                  </SheetTrigger>
                  <SheetContent
                    side="left"
                    className="w-72 border-r-0 bg-[#102e4a] p-0 text-white"
                  >
                    <SidebarContent
                      displayName={displayName}
                      initials={initials}
                      onLogout={handleLogout}
                      CloseWrapper={SheetClose}
                    />
                  </SheetContent>
                </Sheet>
                <div>
                  <p className="text-[0.65rem] font-semibold text-[#94a3b8]">
                    DashUMKM
                  </p>
                  <h1 className="text-sm font-semibold text-[#0f172a]">
                    Setelan
                  </h1>
                </div>
              </div>
            </div>
          </header>

          <main className="px-5 py-6 md:px-8">
            <div className="mx-auto w-full max-w-4xl">
              <Tabs defaultValue="profil" className="w-full">
                <TabsList className="mb-6 grid w-full grid-cols-3 md:w-[400px] bg-[#f1f5f9] text-[#64748b] p-1 rounded-lg">
                  <TabsTrigger value="profil" className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">Profil</span>
                  </TabsTrigger>
                  <TabsTrigger value="keamanan" className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    <span className="hidden sm:inline">Keamanan</span>
                  </TabsTrigger>
                  <TabsTrigger value="sistem" className="flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    <span className="hidden sm:inline">Sistem</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="profil">
                  <Card className="border-[#f1f5f9] shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-xl text-[#0f172a]">Informasi Profil</CardTitle>
                      <CardDescription>
                        Perbarui nama lengkap, nama toko, dan nomor telepon Anda.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form id="profile-form" onSubmit={handleSaveProfile} className="space-y-4">
                        <div className="grid gap-2">
                          <Label htmlFor="email">Email</Label>
                          <Input 
                            id="email" 
                            type="email" 
                            value={user?.email || ""} 
                            disabled 
                            className="bg-gray-50 text-gray-500"
                          />
                          <p className="text-[0.8rem] text-muted-foreground">Email tidak dapat diubah.</p>
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="fullName">Nama Lengkap</Label>
                          <Input 
                            id="fullName" 
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Contoh: Ujang Santosa" 
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="businessName">Nama Toko</Label>
                          <Input 
                            id="businessName" 
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            placeholder="Contoh: Toko Berkah" 
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="phoneNumber">Nomor Telepon / WhatsApp</Label>
                          <Input 
                            id="phoneNumber" 
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="Contoh: 081234567890" 
                          />
                        </div>

                        {profileMsg.text && (
                          <div className={`p-3 rounded-lg text-sm font-medium ${profileMsg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {profileMsg.text}
                          </div>
                        )}
                      </form>
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4 flex justify-end">
                      <Button type="submit" form="profile-form" disabled={isProfileLoading} className="bg-[#102e4a] hover:bg-[#0b2136]">
                        {isProfileLoading ? "Menyimpan..." : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Simpan Profil
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="keamanan">
                  <Card className="border-[#f1f5f9] shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-xl text-[#0f172a]">Ubah Kata Sandi</CardTitle>
                      <CardDescription>
                        Pastikan Anda menggunakan kata sandi yang kuat dan aman.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form id="password-form" onSubmit={handleSavePassword} className="space-y-4">
                        <div className="grid gap-2">
                          <Label htmlFor="oldPassword">Kata Sandi Lama</Label>
                          <div className="relative">
                            <Input 
                              id="oldPassword" 
                              type={showOldPassword ? "text" : "password"} 
                              value={oldPassword}
                              onChange={(e) => setOldPassword(e.target.value)}
                              className="pr-10"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowOldPassword((prev) => !prev)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-slate-600 focus:outline-none"
                            >
                              {showOldPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="newPassword">Kata Sandi Baru</Label>
                          <div className="relative">
                            <Input 
                              id="newPassword" 
                              type={showNewPassword ? "text" : "password"} 
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder="Minimal 8 karakter"
                              className="pr-10"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword((prev) => !prev)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-slate-600 focus:outline-none"
                            >
                              {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="confirmPassword">Konfirmasi Kata Sandi Baru</Label>
                          <div className="relative">
                            <Input 
                              id="confirmPassword" 
                              type={showConfirmPassword ? "text" : "password"} 
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className="pr-10"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword((prev) => !prev)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-slate-600 focus:outline-none"
                            >
                              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>

                        {passwordMsg.text && (
                          <div className={`p-3 rounded-lg text-sm font-medium ${passwordMsg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {passwordMsg.text}
                          </div>
                        )}
                      </form>
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4 flex justify-end">
                      <Button type="submit" form="password-form" disabled={isPasswordLoading} className="bg-[#102e4a] hover:bg-[#0b2136]">
                        {isPasswordLoading ? "Menyimpan..." : (
                          <>
                            <Lock className="mr-2 h-4 w-4" />
                            Perbarui Sandi
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="sistem">
                  <Card className="border-[#f1f5f9] shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-xl text-[#0f172a]">Environment & Integrasi</CardTitle>
                      <CardDescription>
                        Status konektivitas layanan internal dan eksternal DashUMKM.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      
                      <div className="flex items-center justify-between p-4 border rounded-xl bg-white shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${apiStatus === 'ok' ? 'bg-green-100 text-green-600' : apiStatus === 'error' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                            <Globe className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-[#0f172a]">Backend API Server</p>
                            <p className="text-xs text-muted-foreground">Koneksi antara dashboard dan pusat data</p>
                          </div>
                        </div>
                        <div>
                          {apiStatus === 'ok' ? (
                            <span className="flex items-center gap-1.5 text-xs font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
                              <CheckCircle2 className="h-3.5 w-3.5" /> Terhubung
                            </span>
                          ) : apiStatus === 'error' ? (
                            <span className="flex items-center gap-1.5 text-xs font-medium text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
                              <XCircle className="h-3.5 w-3.5" /> Terputus
                            </span>
                          ) : (
                            <span className="text-xs font-medium text-gray-500">Mengecek...</span>
                          )}
                        </div>
                      </div>


                    </CardContent>
                  </Card>
                </TabsContent>

              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
