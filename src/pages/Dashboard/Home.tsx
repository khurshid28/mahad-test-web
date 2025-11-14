import DashboardMetrics from "../../components/dashboard/DashboardMetrics";
import SubjectDistributionChart from "../../components/dashboard/SubjectDistributionChart";
import RecentTests from "../../components/dashboard/RecentTests";
import GroupStatistics from "../../components/dashboard/GroupStatistics";
import PerformanceChart from "../../components/dashboard/PerformanceChart";
import PageMeta from "../../components/common/PageMeta";

export default function Home() {
  return (
    <>
      <PageMeta
        title="Test Tizimi Dashboard"
        description="Test Tizimi Dashboard"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {/* Asosiy statistikalar */}
        <div className="col-span-12">
          <DashboardMetrics />
        </div>

        {/* Fanlar taqsimoti va oxirgi testlar */}
        <div className="col-span-12 space-y-6 xl:col-span-8">
          <SubjectDistributionChart />
          <PerformanceChart />
        </div>

        {/* Guruhlar statistikasi */}
        <div className="col-span-12 xl:col-span-4">
          <GroupStatistics />
        </div>

        {/* Oxirgi testlar */}
        <div className="col-span-12">
          <RecentTests />
        </div>
      </div>
    </>
  );
}
