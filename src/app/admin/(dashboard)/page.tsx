import Link from "next/link";
import { Eye, MessageCircle, Phone, Package, FolderTree, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/admin/shared";
import { getDashboardStats } from "@/services/admin";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const cards = [
    { label: "Page Views Today", value: stats.pageViews, icon: Eye, color: "text-blue-600" },
    { label: "WhatsApp Clicks", value: stats.whatsappClicks, icon: MessageCircle, color: "text-green-600" },
    { label: "Call Clicks", value: stats.callClicks, icon: Phone, color: "text-orange-600" },
    { label: "Categories", value: stats.categoryCount, icon: FolderTree, color: "text-purple-600" },
    { label: "Items", value: stats.itemCount, icon: Package, color: "text-indigo-600" },
    { label: "Testimonials", value: stats.testimonialCount, icon: Star, color: "text-amber-600" },
  ];

  return (
    <div>
      <PageHeader title="Dashboard" description="Overview of today's activity and content counts" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.label}
                </CardTitle>
                <Icon className={`h-5 w-5 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{card.value.toLocaleString()}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {stats.topViewedItem ? (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Top Viewed Item Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between gap-4">
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
              className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
            >
              Edit item →
            </Link>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
