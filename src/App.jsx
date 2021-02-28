import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import ResasApi from './api/resas';

import './sass/style.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [prefs, setplefs] = useState([]);
  const [checkedPrefs, setCheckedPrefs] = useState({})
  const [populations, setPopulations] = useState({})
  const [displayPopulations, setDisplayPopulations] = useState({})

  // 都道府県セット
  useEffect(() => {
    const fetchPref = async () => {
      try {
        const response = await ResasApi.pref();
        setplefs(response.result);
      } catch (exception) {
        console.error(exception);
        if (exception.message) {
          setError(exception.message);
        }
      }
    };
    fetchPref();
    return () => {};
  }, []);

  // 表示用のデータセット
  useEffect(() => {
    let display = [];
    for (const [_, values] of Object.entries(populations)) {
        display.push(values);
      }
    setDisplayPopulations(display);

  }, [populations]);

  // 人口推移データの取得
  const fetchPopulation = async (id) => {
    Object.filter = function(mainObject, filterFunction){
      return Object.keys(mainObject)
        .filter( function(ObjectKey){
            return filterFunction(mainObject[ObjectKey])
        } )
        .reduce( function (result, ObjectKey){
          result[ObjectKey] = mainObject[ObjectKey];
          return result;
          }, {} );
      }
    try {
      if (Object.keys(populations).indexOf(id) == -1) {
        const response = await ResasApi.population(id);
        let tmp = [];
        Object.keys(response.result.data[0].data).forEach(i => {
          tmp.push(response.result.data[0].data[i].value);
          });
        setPopulations({...populations,
          [id]: {id: id, data: tmp, name: prefs[id-1].prefName}});
      } else {
        setPopulations(Object.filter(populations, function(pop) {
          return pop.id != id
        }));
      }
    } catch (exception) {
      console.error(exception);
      if (exception.message) {
        setError(exception.message);
      }
    }
  };

  // 都道府県チェックボックス
  const PrefList = () => prefs.map((pref) => {
    const CheckBox = ({pref, checked, onChange}) => {
      if (!pref) {
        return (<></>);
      }
      return (
        <input
          id={`id_${pref.prefCode}`}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          value={pref.prefCode}
        />
      )
    }
    return (
      <div className='btn_wrap'>
        <CheckBox
            pref={pref}
            onChange={handleChange}
            checked={checkedPrefs[pref.prefCode]}
          />
        <label htmlFor={`id_${pref.prefCode}`} key={`key_${pref.prefCode}`}>
        {pref.prefName}
      </label>
    </div>
    );
  })

  // チェックボックス押下時の挙動
  const handleChange = e => {
    setCheckedPrefs({
      ...checkedPrefs,
      [e.target.value]: e.target.checked
    })
    fetchPopulation(e.target.value);

  }

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
    <div>
      <div className="row content mt-2">
        <div className="col-md-12 mt-3">
            <p className="h4 mb-3 text-center">都道府県別人口推移グラフ</p>
        </div>
        <div className="col-md-12 mt-3">
            <p className="mb-3 text-center">選択した都道府県の人口推移グラフが表示されます。</p>
        </div>
        <div className="col-md-12">
          {PrefList()}
        </div>
        <div className="col-md-12">
          {Object.keys(displayPopulations).length ? chart() : ''}
        </div>
      </div>
    </div>
  );
};
ReactDOM.render(<App />, document.getElementById('app'));