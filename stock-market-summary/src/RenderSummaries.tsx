import TopGainers from "./TopGainers";
import TopLosers from "./TopLosers";
import MostActive from "./MostActive";
//import BubbleChart from "./BubbleChart";

function RenderSummaries() {
  return (
    <div className="container">
      <h2>Stock Market Summaries</h2>
      <MostActive />
      <div className="table_div">
        <table>
          <thead>
            <tr>
              <th>Top Gainers</th>
              <th></th>
              <th>Top Losers</th>
            </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <TopGainers />
                </td>
                <td></td>
                <td>
                  <TopLosers />
                </td>
              </tr>
            </tbody>
          
        </table>
      </div>
      {/* <BubbleChart /> */}
    </div>
  );
};

export default RenderSummaries;