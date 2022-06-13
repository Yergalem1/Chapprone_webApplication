import React, { useState, useEffect } from "react";
import "./styles.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,

  BarChart, Bar, Cell
} from "recharts";




const Rechart = () => {


  const [charts, setCharts] = useState([]);

  const fetchData = async () => {
    const BASE_URL = "http://localhost:5001/chapperone-6a910/us-central1/api";
    const res = await fetch(`${BASE_URL}/all_trips`);
    const data = await res.json();
    console.log("data from api", data.results);
    setCharts(data.results);
  };

  useEffect(() => {
    fetchData();
  }, []);

  //  render() {
  return (
    <>
   <h2 className="header">Trip Information Count</h2>
   <ResponsiveContainer width="100%" aspect={3}>

    <LineChart
    width={1000}
    height={200}
    data={charts}
    margin={{
      top: 5,
      right: 30,
      left: 20,
      bottom: 5
    }}
  >
  <CartesianGrid horizontal="true"  vertical="" stroke="#eee" strokeDasharray="5 5" />
    <XAxis dataKey="Start_date"tick={{fill:"#fff"}}/>
    <YAxis tick={{fill:"#fff"}} />
     <Tooltip contentStyle={{ backgroundColor: "#8884d8", color: "#fff" }} itemStyle={{ color: "#fff" }} cursor={false}/>
    <Legend />
    <Line
      type="monotone"
      dataKey="Number_Of_Student"
      stroke="#db0b27"
      activeDot={{ r: 8 }}
    />
    <Line type="monotone" dataKey="Number_Of_Teacher" stroke="#3f6641" />
    <Line type="monotone" dataKey="broadcastsCount" stroke="#3f6641" />
    <Line type="monotone" dataKey="messageCount" stroke="#3f6641" />
  </LineChart>
 </ResponsiveContainer> 

    
  </>);
};

export default Rechart;

