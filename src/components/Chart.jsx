import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const Chart = (props) => {
  const [displayPopulations, setDisplayPopulations] = useState({})

  // 表示用のデータセット
  useEffect(() => {
    let display = [];
    for (const [_, values] of Object.entries(props.populations)) {
        display.push(values);
      }
    setDisplayPopulations(display);

  }, [props.populations]);

  // グラフ
  const chart = () => {
    const options = {
      title: {
        text: '人口推移'
      },
      plotOptions: {
        series: {
          label: {
            connectorAllowed: false
          },
          pointInterval: 5,
          pointStart: 1965,
        }
      },
      series: displayPopulations
    };
    return (
      <div className="mt-5">
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    )
  }

  return (
    <div className="col-md-12">
        {Object.keys(displayPopulations).length ? chart() : ''}
    </div>
  );
};
export default Chart;