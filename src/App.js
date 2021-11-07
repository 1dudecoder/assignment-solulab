import { useEffect, useState } from "react";
import "./App.css";
import M from "materialize-css"
import useNetworkStatus from "./useNetworkStatus";

function App() {

  const [low, setLow] = useState(0);
  const [mypercentage, setMypercentage] = useState(0);
  const [high, setHigh] = useState(0);
  const [volume, setVolume] = useState(0);
  const [lastPrice, setLastPrice] = useState(0);
  const [dailyChangeRelative, setdailyChangeRelative] = useState(0);
  const [reconnect, setReconnect] = useState(true);
  const status = useNetworkStatus();

  console.log("Internet connection" , status)
  
  function separator(numb) {
    var str = numb.toString().split(".");
    str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return str.join(".");
  }

  function datavalidation(arr) {
    let newarr = JSON.parse(arr);
    if (Array.isArray(newarr)) {
      console.log("hellow bro", newarr);
      let notstring = newarr[1];
      if (typeof notstring != "string") {
        console.log(notstring);
        setLow(notstring[9]);
        setHigh(notstring[8]);
        setVolume(parseInt(notstring[7]));
        setLastPrice(parseInt(notstring[6]));
        setdailyChangeRelative((notstring[4]).toFixed(2));
        setMypercentage(notstring[5]);
      }
    }
  }

  useEffect(() => {
    if (reconnect) {
      const ws = new WebSocket("wss://api-pub.bitfinex.com/ws/2");
      let subscribe = JSON.stringify({
        event: "subscribe",
        channel: "ticker",
        symbol: "tBTCUSD",
      });

      ws.onopen = () => {
        ws.send(subscribe);
      };

      ws.onmessage = (event) => {
        datavalidation(event.data);
      };

      ws.onerror = (e) => {
        console.log(e.message);
      };

      return () => {
        ws.close();
      };
    }
  }, [reconnect,status]);

  return (
    <div className="App">
      <div className="Container">
        <div className="tag-container">
          <div className="bit-logo">
            <img
              src="https://www.pngkit.com/png/full/30-303629_cryptocurrency-ticker-cryptocurrency-ticker-at-master-white-bitcoin.png"
              alt="bitcoin"
              width="30"
              hight="30"
            />
          </div>

          <div className="titles">
            <h4>BTC/USD</h4>
            <p>
              VOL {separator(volume * lastPrice)}{" "}
              <span style={{ textDecoration: "underline" }}>BTC</span>
            </p>
            <p>LOW {separator(low)}</p>
          </div>
        </div>

        <div className="my-data">
          <p>{separator(lastPrice)}</p>

          {
            mypercentage * 100 > 0 ? <p style={{color:"#01a781"}}> { separator(dailyChangeRelative)  } <span style={{color:"#01a781"}}>⏶</span> ({(mypercentage * 100).toFixed(2) }%) </p>    : <p style={{color:"#e44b44"}}> { separator(dailyChangeRelative)} <span style={{color:"#e44b44"}}>⏷</span> ({ (mypercentage * 100).toFixed(2)}%)</p> 
          }


          <p>HIGHT {separator(high)}</p>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          marginTop: "5rem",
        }}
      >
        <button
          onClick={() => {
            setReconnect(true);
            M.toast({html: 'CONNECTION RECONNECTED SUCCESFULL!',classes:"blue"})  
            console.log("connection reconnected");
          }}
        >
          Connect
        </button>
        <button
          onClick={() => {
            setReconnect(false);
            M.toast({html: 'CONNECTION DISCONNECTED SUCCESFULL!',classes:"red"})  
            console.log("connection is closed");
          }}
        >
          Disconnect
        </button>
      </div>
    </div>
  );
}

export default App;
