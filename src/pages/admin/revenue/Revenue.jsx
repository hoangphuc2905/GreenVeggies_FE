import RevenueList from "./revenueCard/RevenueList";
import DemoColumnChart from "./revenuePayment/Index";
import AnnualRevenueStats from "./annualRevenueStats/AnnualRevenueStats";

const Revenue = () => {
  return (
    <div>
      <RevenueList></RevenueList>
      <DemoColumnChart></DemoColumnChart>
      <AnnualRevenueStats></AnnualRevenueStats>
    </div>
  );
};

export default Revenue;
