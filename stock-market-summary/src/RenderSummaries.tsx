import TopGainers from "./TopGainers";
import TopLosers from "./TopLosers";
import MostActive from "./MostActive";
import BubbleChart from "./BubbleChart";

function RenderSummaries() {
  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let currentDate = `${month}/${day}/${year}`;
  return (
    <div className="container">
      <h3>Stock Market Activity: {currentDate}</h3>
      <div className="summaries">
        <table className="full-width-table">
          <thead>
            <tr>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="half-width">
                <div className="graph_div"><BubbleChart /></div>
              </td>
              <td className="half-width">
                <div className="table_div">
                  <table>
                    <thead>
                      <tr>
                        <th>Top Gainers</th>
                        <th>Top Losers</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <TopGainers />
                        </td>
                        <td>
                          <TopLosers />
                        </td>
                      </tr>
                    </tbody>

                  </table>
                </div>
              </td>
            </tr>
          </tbody>

        </table>
      </div>
      <div> <MostActive /></div>

    </div>
  );
};

export default RenderSummaries;