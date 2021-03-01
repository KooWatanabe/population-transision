import React, { useState, useEffect } from 'react';
import ResasApi from '../api/resas';

const App = (props) => {
  const [prefs, setplefs] = useState([]);
  const [checkedPrefs, setCheckedPrefs] = useState({})
  const [error, setError] = useState({})

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
      if (Object.keys(props.populations).indexOf(id) == -1) {
        const response = await ResasApi.population(id);
        let tmp = [];
        Object.keys(response.result.data[0].data).forEach(i => {
          tmp.push(response.result.data[0].data[i].value);
          });
          props.setPopulations({...props.populations,
          [id]: {id: id, data: tmp, name: prefs[id-1].prefName}});
      } else {
        props.setPopulations(Object.filter(props.populations, function(pop) {
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

  return (
    <div className="col-md-12">
        {PrefList()}
    </div>
  );
};
export default App;