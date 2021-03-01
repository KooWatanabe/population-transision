import React, { useState } from 'react';
import Prefecture from './Prefecture';
import Chart from './Chart';

const App = () => {
  const [populations, setPopulations] = useState({})

  return (
    <div>
      <div className="row content mt-2">
        <div className="col-md-12 mt-3">
            <p className="h4 mb-3 text-center">都道府県別人口推移グラフ</p>
        </div>
        <div className="col-md-12 mt-3">
            <p className="mb-3 text-center">選択した都道府県の人口推移グラフが表示されます。</p>
        </div>
        <Prefecture populations={populations} setPopulations={setPopulations} />
        <Chart populations={populations}/>
      </div>
    </div>
  );
};
export default App;