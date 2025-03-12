import RevenueList from "./revenueCard/RevenueList";
import DemoColumnChart from "./revenuePayment/ChartComponent";
import AnnualRevenueStats from "./annualRevenueStats/AnnualRevenueStats";

const Revenue = () => {
  return (
    <div>
      <RevenueList></RevenueList>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DemoColumnChart></DemoColumnChart>
        <AnnualRevenueStats></AnnualRevenueStats>
      </div>
    </div>
  );
};

export default Revenue;
