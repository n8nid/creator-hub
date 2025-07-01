import { HeaderNav } from "@/components/header-nav";
import {
  Search,
  Download,
  Users,
  Star,
  Filter,
  ArrowRight,
  Workflow,
  Zap,
} from "lucide-react";

const workflows = [
  {
    id: 1,
    title: "E-commerce Order Management",
    description:
      "Otomatisasi pengelolaan pesanan dari berbagai platform e-commerce ke sistem inventory",
    category: "E-commerce",
    nodes: 8,
    downloads: 245,
    author: "Ahmad Rizki",
    tags: ["Shopee", "Tokopedia", "Inventory"],
  },
  {
    id: 2,
    title: "WhatsApp Business Integration",
    description:
      "Integrasi WhatsApp Business API dengan CRM untuk customer service otomatis",
    category: "Communication",
    nodes: 12,
    downloads: 189,
    author: "Sari Dewi",
    tags: ["WhatsApp", "CRM", "Customer Service"],
  },
  {
    id: 3,
    title: "Data Sync & Backup",
    description:
      "Sinkronisasi data real-time antara database dan cloud storage dengan backup otomatis",
    category: "Data Management",
    nodes: 6,
    downloads: 156,
    author: "Budi Santoso",
    tags: ["Database", "Cloud", "Backup"],
  },
  {
    id: 4,
    title: "Social Media Analytics",
    description:
      "Monitoring dan analisis performa konten di berbagai platform media sosial",
    category: "Analytics",
    nodes: 15,
    downloads: 298,
    author: "Maya Putri",
    tags: ["Instagram", "Facebook", "Analytics"],
  },
  {
    id: 5,
    title: "Invoice Automation",
    description:
      "Otomatisasi pembuatan dan pengiriman invoice berdasarkan data penjualan",
    category: "Finance",
    nodes: 10,
    downloads: 167,
    author: "Andi Wijaya",
    tags: ["Invoice", "Finance", "Email"],
  },
  {
    id: 6,
    title: "Lead Generation Pipeline",
    description:
      "Pipeline otomatis untuk mengumpulkan dan memproses lead dari berbagai sumber",
    category: "Marketing",
    nodes: 14,
    downloads: 223,
    author: "Lisa Maharani",
    tags: ["Lead", "Marketing", "CRM"],
  },
  {
    id: 7,
    title: "Inventory Management",
    description:
      "Sistem manajemen stok otomatis dengan notifikasi low stock dan reorder",
    category: "Operations",
    nodes: 9,
    downloads: 134,
    author: "Rudi Hermawan",
    tags: ["Inventory", "Stock", "Notification"],
  },
  {
    id: 8,
    title: "Email Marketing Campaign",
    description:
      "Kampanye email marketing otomatis dengan segmentasi customer dan A/B testing",
    category: "Marketing",
    nodes: 11,
    downloads: 201,
    author: "Nina Sari",
    tags: ["Email", "Marketing", "Segmentation"],
  },
  {
    id: 9,
    title: "HR Onboarding Process",
    description:
      "Proses onboarding karyawan baru dengan checklist dan notifikasi otomatis",
    category: "HR",
    nodes: 7,
    downloads: 89,
    author: "Dedi Kurniawan",
    tags: ["HR", "Onboarding", "Checklist"],
  },
  {
    id: 10,
    title: "Content Publishing Scheduler",
    description:
      "Penjadwalan dan publikasi konten otomatis ke berbagai platform media sosial",
    category: "Content",
    nodes: 13,
    downloads: 176,
    author: "Fitri Handayani",
    tags: ["Content", "Scheduler", "Social Media"],
  },
  {
    id: 11,
    title: "Customer Feedback Analysis",
    description:
      "Analisis sentiment dan kategorisasi feedback customer dari berbagai channel",
    category: "Analytics",
    nodes: 16,
    downloads: 142,
    author: "Agus Pratama",
    tags: ["Feedback", "Sentiment", "Analysis"],
  },
  {
    id: 12,
    title: "Payment Gateway Integration",
    description:
      "Integrasi multiple payment gateway dengan reconciliation otomatis",
    category: "Finance",
    nodes: 12,
    downloads: 267,
    author: "Rina Oktavia",
    tags: ["Payment", "Gateway", "Reconciliation"],
  },
];

const categories = [
  "All",
  "E-commerce",
  "Communication",
  "Data Management",
  "Analytics",
  "Finance",
  "Marketing",
  "Operations",
  "HR",
  "Content",
];

export default function WorkflowsPage() {
  return (
    <>
      <HeaderNav />
      {/* Hero Section with Gradient Background */}
      <div className="relative bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                <Workflow className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Semua Workflow
            </h1>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto leading-relaxed">
              Temukan dan gunakan workflow automation yang telah dibuat oleh
              komunitas N8N Indonesia
            </p>
            <div className="flex justify-center items-center gap-8 mt-8 text-purple-200">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                <span className="text-sm font-medium">
                  {workflows.length} Workflows
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span className="text-sm font-medium">12 Contributors</span>
              </div>
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                <span className="text-sm font-medium">2.1k Downloads</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Filters and Search Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-12">
          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari workflow berdasarkan nama, kategori, atau tag..."
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors text-lg"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="text-gray-700 font-medium">
              Filter by category:
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category, index) => (
              <button
                key={category}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                  index === 0
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-purple-50 hover:text-purple-700 hover:shadow-md"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Workflows Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {workflows.map((workflow) => (
            <div
              key={workflow.id}
              className="group bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-2xl hover:border-purple-200 transition-all duration-300 cursor-pointer transform hover:-translate-y-2 relative overflow-hidden"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/0 to-pink-50/0 group-hover:from-purple-50/50 group-hover:to-pink-50/30 transition-all duration-300 rounded-2xl"></div>

              <div className="relative z-10">
                {/* Category Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center px-3 py-1 text-xs font-semibold bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 rounded-full">
                    {workflow.category}
                  </span>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-xs font-medium text-gray-600">
                      4.8
                    </span>
                  </div>
                </div>

                {/* Icon */}
                <div className="mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Workflow className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-purple-700 transition-colors">
                  {workflow.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                  {workflow.description}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4 bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="font-medium">{workflow.nodes} nodes</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    <span className="font-medium">{workflow.downloads}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {workflow.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs bg-white border border-gray-200 text-gray-700 rounded-full hover:border-purple-300 hover:text-purple-700 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Author and Action */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {workflow.author.charAt(0)}
                    </div>
                    <span className="text-sm text-gray-600 font-medium">
                      {workflow.author}
                    </span>
                  </div>
                  <button className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-800 font-semibold group-hover:gap-2 transition-all">
                    <span>View</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-16">
          <button className="group px-12 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 font-semibold text-lg">
            <span className="flex items-center gap-3">
              Load More Workflows
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
          <p className="text-gray-500 text-sm mt-4">
            Showing 12 of 50+ workflows
          </p>
        </div>
      </div>
    </>
  );
}
