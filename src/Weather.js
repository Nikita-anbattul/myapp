import React, { useEffect, useState } from 'react';
import "./Style.css";
// import HorizontalScroll from 'react-scroll-horizontal'

function Weather() {
  const [search, setSearch] = useState('Mumbai');
  const [current, setCurrent] = useState(null);
  
  const [city, setCity] = useState('');
  const [hourly, setHourly] = useState(null);
  const [daily, setDaily] = useState(null);
  const [data, setData] = useState(null);

  // Weekly day function
  let setDayOfWeek = function (dayNum) {
    var weekday = new Array(7);

    var days = [
      'SUN',
      'MON',
      'TUE',
      'WED',
      'THU',
      'FRI',
      'SAT',
    ];
    var d = new Date();
    var dayName = days[d.getDay()];
    var s = (d.getDay() + 1 + dayNum) % 7;
    return days[s];
  };
  // console.log(setDayOfWeek());

  // timeing function
  let settimes = function (timeNum) {
    var hour = new Array(47);
    var date = new Date();
    var hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
    var am_pm = date.getHours() >= 12 ? 'pm' : 'am';
    // time conversion function am pm
    function nexthourampm(hour, ampm) {
      let nexthour, nextampm;
      if (hour === 11) {
        nexthour = 12;
        if (ampm === 'am') {
          nextampm = 'pm';
        } else {
          nextampm = 'am';
        }
      } else if (hour === 12) {
        nexthour = 1;
        if (ampm === 'am') {
          nextampm = 'am';
        } else {
          nextampm = 'pm';
        }
      } else {
        nexthour = hour + 1;
        nextampm = ampm;
      }
      return [nexthour, nextampm];
    }

    hour[0] = nexthourampm(hours, am_pm);
    for (let i = 1; i < 48; i++) {
      hour[i] = nexthourampm(hour[i - 1][0], hour[i - 1][1]);
    }
    return hour[timeNum];
  };

  // light mode dark mode function

  // fetching data using api
  useEffect(() => {
    const fetchApi = async () => {
      const API_KEY = 'd6a2451b8470d2907cad790ebb180242';
      //   const current = `http://api.openweathermap.org/data/2.5/weather?q=${search}&units=metric&appid=b0e89df602025b1b2525a9bd5f0c21d8`;
      //   const hourly = `http://pro.openweathermap.org/data/2.5/forecast/hourly?q=${search}&appid=b0e89df602025b1b2525a9bd5f0c21d8`;
      const exclude = 'minutely,alerts';
      const latlonuri = `http://api.positionstack.com/v1/forward?access_key=fab80d93ef21989e45e301fbf8f51ca2&query=${search}`;
      const latlonres = await fetch(latlonuri);
      const latlondata = await latlonres.json();
      // console.log(latlondata);

      if ( latlondata?.data && latlondata.data.length>0 ) {

        const { latitude=0, longitude=0, name="no data" } = latlondata?.data[0];
       

        const uri = `https://api.openweathermap.org/data/2.5/onecall?units=metric&lat=${latitude}&lon=${longitude}&exclude=${exclude}&appid=${API_KEY}`;
        const weatherres = await fetch(uri);
        const data = await weatherres.json();
        console.log(data);
        setData(data);
        const { daily, hourly, current } = data;
        setCurrent(data.current);
        // console.log(data.current);
        // console.log(data.hourly);
        setHourly(data.hourly);
        setDaily(data.daily);
        // console.log(data.daily);
      
      }

    else{  setData(false);}
    };
    fetchApi();
  }, [search]);

  var days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  var d = new Date();
  var dayN = d.getDay();
  var newS;

  const handleS=(e)=>{
    e.preventDefault();
    if(newS){
    setSearch(newS);
    }
  }


  return (
    <main>


      <div className="main">
        {/* <pre>{JSON.stringify(data.current, null, 4)}</pre> */}
        
        <header>Weather Forecast</header>
        <div className="box" id="box">
          {/* dark mode button,,8iuiiu */}
         
       
         <div className="input_search">
          {/*input of city*/}
          <div className="input">
         
          <form onSubmit={handleS}>
          <div className="icon">
               <i className="fas fa-search"></i>
             </div>
             {/* <i className="fas fa-search"></i> */}
              <input
                type="Search"
               
                placeholder="Enter name of city"
                onChange={ (e)=>{newS=e.target.value;}}
              />
              <button className="btn">Search</button>
              </form>
              
            </div>
            
           
          </div>
         
       
    
        

          {!data ? (
            <div className="p">
              <h1>NO DATA FOUND</h1>
              
            </div>
          ) : (
            <>
              <div className="nextpage">
                <div className="info">
                <h1 className="Location">
                    <i className="fas fa-street-view"></i>
                    {search}
                  </h1>
                  <br/>
                  <br/>
                  <h1>{days[dayN]}</h1>
        
                  <h2 className="temp">{current?.temp}°C</h2>


                </div>
              </div>
    
              {/* <h3 className="InfoName">INFORMATION</h3> */}
              {/* <Scrollbar style={{width:"10px",height:"3px"}}> */}
              <div className="hourly">
                <h3>HOURLY FORECAST</h3>
                
                <ol>
                  {data.hourly.map((x, key) => (
                    <div className="card">
                      {settimes(key)}
                    
                      
                     <img width="50"src={`http://openweathermap.org/img/wn/${x.weather[0].icon}@4x.png`}/>
                      <br />
                      <h5>{x.weather[0].main}</h5>
                      {x.temp}°<span className="celcius">C</span>
                    </div>
                  ))}
                </ol>
     
              </div>
              {/* </Scrollbar> */}
          
              <div className="daily">
                <h3>DAILY FORECAST</h3>

                <ol>
                  {data.daily.slice(1).map((y, key) => (
                    <div className="card">
                      {setDayOfWeek(key)}<br/>
                      <img width="50"src={`http://openweathermap.org/img/wn/${y.weather[0].icon}@4x.png`}/>
                      <br/>
                      <h5>{y.weather[0].main}</h5>
                      {y.temp.day}°<span className="celcius">C</span>

                    </div>
                  ))}
                </ol>
              </div>
            </>
          )}
        </div>
      </div>

    </main>
  );
}

export default Weather;














