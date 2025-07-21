"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  ChevronLeft, 
  ChevronRight,
  Menu,
  X,
  User,
  MapPin,
  Globe,
  Linkedin,
  Instagram
} from "lucide-react";

export function TabletDemo() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Tablet Responsive Demo</h1>
          
          {/* Device Indicators */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex tablet:hidden lg:flex items-center gap-1 text-xs text-gray-500">
              <Smartphone className="w-3 h-3" />
              <span>Mobile</span>
            </div>
                            <div className="hidden tablet:flex lg:hidden items-center gap-1 text-xs text-gray-600">
              <Tablet className="w-3 h-3" />
              <span>Tablet</span>
            </div>
            <div className="hidden lg:flex items-center gap-1 text-xs text-gray-500">
              <Monitor className="w-3 h-3" />
              <span>Desktop</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Responsive */}
        <div className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          tablet:relative tablet:translate-x-0 tablet:z-auto
          ${sidebarOpen ? 'tablet:w-64' : 'tablet:w-16'}
        `}>
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-4 border-b tablet:hidden">
            <h2 className="text-lg font-semibold">Menu</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="p-1"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Sidebar Content */}
          <nav className="p-4">
            <div className="space-y-2">
              {[
                { icon: "🏠", label: "Dashboard", active: true },
                { icon: "📊", label: "Analytics", active: false },
                { icon: "👥", label: "Users", active: false },
                { icon: "⚙️", label: "Settings", active: false },
              ].map((item, index) => (
                <div
                  key={index}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors
                    ${item.active ? 'bg-gray-100 text-gray-700' : 'text-gray-700 hover:bg-gray-100'}
                    ${!sidebarOpen ? 'tablet:justify-center tablet:px-2' : ''}
                  `}

                >
                  <span className="text-lg">{item.icon}</span>
                  {sidebarOpen && <span className="tablet:block">{item.label}</span>}
                </div>
              ))}
            </div>
          </nav>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 tablet:hidden"
            onClick={toggleSidebar}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4">
          {/* Mobile Menu Button */}
          <div className="sm:hidden mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleSidebar}
              className="flex items-center gap-2"
            >
              <Menu className="w-4 h-4" />
              Menu
            </Button>
          </div>

          {/* Content Grid */}
          <div className="space-y-6">
            {/* Breakpoint Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tablet className="w-5 h-5" />
                  Current Breakpoint
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 tablet:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-100 rounded-lg">
                    <Smartphone className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                    <p className="text-sm font-medium">Mobile</p>
                    <p className="text-xs text-gray-500">&lt; 768px</p>
                  </div>
                  <div className="text-center p-4 bg-gray-100 rounded-lg">
                    <Tablet className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                    <p className="text-sm font-medium">Tablet</p>
                    <p className="text-xs text-gray-500">768px - 1024px</p>
                  </div>
                  <div className="text-center p-4 bg-gray-100 rounded-lg">
                    <Monitor className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                    <p className="text-sm font-medium">Desktop</p>
                    <p className="text-xs text-gray-500">&gt; 1024px</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Responsive Grid Demo */}
            <Card>
              <CardHeader>
                <CardTitle>Responsive Grid Layout</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 tablet:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div
                      key={item}
                      className="p-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg border"
                    >
                      <div className="text-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold">
                          {item}
                        </div>
                        <p className="text-sm font-medium">Card {item}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Responsive content
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Sidebar Toggle Demo */}
            <Card>
              <CardHeader>
                <CardTitle>Sidebar Controls</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Button
                      onClick={toggleSidebar}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      {sidebarOpen ? (
                        <>
                          <ChevronLeft className="w-4 h-4" />
                          Collapse Sidebar
                        </>
                      ) : (
                        <>
                          <ChevronRight className="w-4 h-4" />
                          Expand Sidebar
                        </>
                      )}
                    </Button>
                    
                    <Badge variant={sidebarOpen ? "default" : "secondary"}>
                      {sidebarOpen ? "Expanded" : "Collapsed"}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <p><strong>Mobile:</strong> Sidebar slides in/out with overlay</p>
                    <p><strong>Tablet:</strong> Sidebar collapses to icon-only mode</p>
                    <p><strong>Desktop:</strong> Sidebar stays expanded by default</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Responsive Text */}
            <Card>
              <CardHeader>
                <CardTitle>Responsive Typography</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h1 className="text-2xl tablet:text-3xl lg:text-4xl font-bold">
                    Responsive Heading
                  </h1>
                  <p className="text-sm tablet:text-base lg:text-lg text-gray-600">
                    This text scales appropriately across different screen sizes.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="text-xs tablet:text-sm">Mobile</Badge>
                    <Badge className="text-xs tablet:text-sm">Tablet</Badge>
                    <Badge className="text-xs tablet:text-sm">Desktop</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Header Navigation Demo */}
            <Card>
              <CardHeader>
                <CardTitle>Header Navigation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="hidden sm:flex items-center gap-2 tablet:gap-3 lg:gap-6">
                    <a href="#" className="text-sm tablet:text-sm font-medium text-gray-600 hover:text-gray-800">
                      Dashboard Profile
                    </a>
                    <a href="#" className="text-sm tablet:text-sm font-medium text-gray-600 hover:text-gray-900">
                      Workflow Saya
                    </a>
                    <a href="#" className="text-sm tablet:text-sm font-medium text-gray-600 hover:text-gray-900">
                      Creator Saya
                    </a>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p><strong>Mobile:</strong> Navigation disembunyikan, gunakan hamburger menu</p>
                    <p><strong>Tablet & Desktop:</strong> Navigation tetap terlihat di header untuk akses cepat</p>
                    <p><strong>Sidebar:</strong> Dapat di-collapse untuk menghemat ruang</p>
                    <p><strong>Toggle:</strong> Tombol di header untuk kontrol sidebar</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Card Demo */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Card Responsive</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 tablet:grid-cols-3 lg:grid-cols-4 gap-4">
                    <div className="p-3 sm:p-4 tablet:p-6 lg:p-6 w-full max-w-xs tablet:max-w-sm mx-auto border rounded-lg">
                      <div className="text-center mb-4 sm:mb-5 tablet:mb-6 lg:mb-6">
                        <div className="tablet:flex tablet:justify-center">
                          <div className="h-24 w-24 sm:h-32 tablet:h-36 lg:h-40 sm:w-32 tablet:w-36 lg:w-40 mx-auto mb-3 sm:mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-xl sm:text-2xl tablet:text-2xl lg:text-3xl font-bold text-gray-600">BC</span>
                        </div>
                        </div>
                        <h3 className="text-lg sm:text-xl tablet:text-base lg:text-2xl font-bold text-gray-900 mb-2 text-center">
                          Bagus Christiannanta
                        </h3>
                        <div className="mb-2">
                          <Badge variant="secondary" className="text-xs sm:text-sm tablet:text-sm">intermediate</Badge>
                        </div>
                        <p className="text-gray-600 mb-4 text-sm sm:text-sm tablet:text-sm lg:text-base">
                          Hello, Chief
                        </p>
                        <div className="tablet:flex tablet:justify-center">
                          <Button className="w-full text-sm sm:text-sm tablet:text-sm lg:text-base px-4 py-2 sm:px-4 tablet:px-6 lg:px-6 sm:py-2 tablet:py-3 lg:py-3">
                            Edit Profile
                          </Button>
                        </div>
                      </div>
                      <div className="text-left space-y-3 sm:space-y-3 tablet:space-y-4 lg:space-y-4">
                        {/* Mobile & Desktop Layout */}
                        <div className="flex gap-4 sm:gap-6 text-xs sm:text-sm tablet:text-sm lg:text-base tablet:hidden lg:flex">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3 sm:h-4 tablet:h-4 lg:h-4 sm:w-4 tablet:w-4 lg:w-4 text-gray-600" />
                            <span className="font-semibold">0</span>
                            <span className="text-gray-600">followers</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="font-semibold">0</span>
                            <span className="text-gray-600">following</span>
                          </div>
                        </div>
                        
                        {/* Tablet Layout */}
                        <div className="hidden tablet:block lg:hidden space-y-2 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <User className="h-4 w-4 text-gray-600" />
                            <span className="font-semibold">0</span>
                            <span className="text-gray-600">followers</span>
                          </div>
                          <div className="flex items-center justify-center gap-1">
                            <span className="font-semibold">0</span>
                            <span className="text-gray-600">following</span>
                          </div>
                        </div>
                        <div className="flex items-center text-gray-600 text-xs sm:text-sm tablet:text-sm lg:text-base">
                          <MapPin className="h-3 w-3 sm:h-4 tablet:h-4 lg:h-4 sm:w-4 tablet:w-4 lg:w-4 mr-1" />
                          DI Yogyakarta, Sleman
                        </div>
                        <div className="flex gap-3 sm:gap-4">
                          <Globe className="h-4 w-4 sm:h-4 tablet:h-5 lg:h-5 sm:w-4 tablet:w-5 lg:w-5 text-gray-600" />
                          <Linkedin className="h-4 w-4 sm:h-4 tablet:h-5 lg:h-5 sm:w-4 tablet:w-5 lg:w-5 text-gray-600" />
                          <Instagram className="h-4 w-4 sm:h-4 tablet:h-5 lg:h-5 sm:w-4 tablet:w-5 lg:w-5 text-gray-600" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p><strong>Card Size:</strong> Diperbesar dari max-w-xs ke max-w-sm di tablet</p>
                    <p><strong>Avatar:</strong> Ukuran proporsional (h-36 w-36 di tablet)</p>
                    <p><strong>User Name:</strong> Font size 1rem dan posisi center di tablet</p>
                    <p><strong>Avatar:</strong> Diposisikan center di tablet</p>
                    <p><strong>Edit Profile Button:</strong> Diposisikan center di tablet menggunakan flexbox wrapper</p>
                    <p><strong>Follower/Following:</strong> Layout vertikal di tablet</p>
                    <p><strong>Typography:</strong> Font size disesuaikan untuk tablet</p>
                    <p><strong>Spacing:</strong> Padding dan margin dioptimalkan</p>
                    <p><strong>Navigation Gap:</strong> Jarak antara nav dan card dikurangi untuk tablet</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
} 