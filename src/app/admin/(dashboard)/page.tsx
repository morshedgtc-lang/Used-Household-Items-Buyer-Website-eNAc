import Link from "next/link";
import { Eye, MessageCircle, Phone, Package, FolderTree, Star, HelpCircle, MapPin, TrendingUp, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/admin/shared";
import { getDashboardStats } from "@/services/admin";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const statCards = [
    { label: "Page Views Today", value: stats.pageViews, icon: Eye, color: "from-blue-500 to-blue-600", bg: "bg-blue-50", text: "text-blue-600", ring: "ring-blue-200" },
    { label: "WhatsApp Clicks", value: stats.whatsappClicks, icon: MessageCircle, color: "from-emerald-500 to-green-600", bg: "bg-emerald-50", text: "text-emerald-600", ring: "ring-emerald-200" },
    { label: "Call Clicks", value: stats.callClicks, icon: Phone, color: "from-orange-500 to-amber-600", bg: "bg-orange-50", text: "text-orange-600", ring: "ring-orange-200" },
    { label: "Categories", value: stats.categoryCount, icon: FolderTree, color: "from-purple-500 to-violet-600", bg: "bg-purple-50", text: "text-purple-600", ring: "ring-purple-200" },
    { label: "Items", value: stats.itemCount, icon: Package, color: "from-indigo-500 to-blue-600", bg: "bg-indigo-50", text: "text-indigo-600", ring: "ring-indigo-200" },
    { label: "Testimonials", value: stats.testimonialCount, icon: Star, color: "from-amber-500 to-yellow-600", bg: "bg-amber-50", text: "text-amber-600", ring: "ring-amber-200" },
  ];

  const quickLinks = [
    { label: "Categories", href: "/admin/categories", icon: FolderTree, color: "text-purple-600 bg-purple-50" },
    { label: "Items", href: "/admin/items", icon: Package, color: "text-indigo-600 bg-indigo-50" },
    { label: "Testimonials", href: "/admin/testimonials", icon: Star, color: "text-amber-600 bg-amber-50" },
    { label: "FAQs", href: "/admin/faqs", icon: HelpCircle, color: "text-rose-600 bg-rose-50" },
    { label: "Cities", href: "/admin/cities", icon: MapPin, color: "text-teal-600 bg-teal-50" },
    { label: "Homepage", href: "/admin/homepage", icon: TrendingUp, color: "text-emerald-600 bg-emerald-50" },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Overview of today's activity and content counts"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label} className="relative overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{card.label}</p>
                    <p className="mt-2 text-3xl font-bold tracking-tight">{card.value.toLocaleString()}</p>
                  </div>
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${card.bg} ring-1 ${card.ring}`}>
                    <Icon className={`h-5 w-5 ${card.text}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {stats.topViewedItem ? (
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Top Viewed Item Today</CardTitle>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between gap-4 rounded-xl bg-muted/30 p-4">
                <div>
                  <p className="font-semibold">{stats.topViewedItem.titleEn}</p>
                  <p className="text-sm text-muted-foreground" dir="rtl">
                    {stats.topViewedItem.titleAr}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{stats.topViewedItem.views}</p>
                  <p className="text-xs text-muted-foreground">views</p>
                </div>
              </div>
              <Link
                href={`/admin/items/${stats.topViewedItem.id}/edit`}
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                Edit item <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-0 shadow-sm">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                <Eye className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="mt-3 text-sm font-medium text-muted-foreground">No views yet today</p>
              <p className="text-xs text-muted-foreground/70">Page views will appear here once visitors start browsing</p>
            </CardContent>
          </Card>
        )}

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2">
              {quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group flex flex-col items-center gap-2 rounded-xl border border-border/50 p-3 text-center transition-all hover:border-primary/30 hover:bg-primary/5 hover:shadow-sm"
                  >
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${link.color} transition-transform group-hover:scale-110`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground">{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
