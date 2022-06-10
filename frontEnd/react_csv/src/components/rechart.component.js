import React, { useState, useEffect} from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

 const data = [
    {
      name: "March",
      Iphone: 1000,
    },
    {
      name: "May",
      Iphone: 4000,
    },
    {
      name: "July",
      Iphone: 800,
    },
    {
      name: "October",
      Iphone: 1500,
    },
  ]; 
  
const Rechart = () =>  {
    const [charts, setCharts] = useState([])

    const fetchData = async () => {
       const BASE_URL = 'http://localhost:5001/chapperone-6a910/us-central1/api'
      const res = await fetch(`${BASE_URL}/all_users`)
      const data = await res.json()
      console.log(data.data)
      setCharts(data.data)
    }
  
    useEffect(() => {
      fetchData()
    }, [])
     
   return (
     <>
      <ResponsiveContainer width="100%" aspect={3}>
     <LineChart
        width={3000}
        height={3000}
        data={data}
        margin={{
          top: 15,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid  horizontal="true" vertical="" stroke="#243240"/>
        <XAxis dataKey="name" tick={{fill:"#fff"}}/>
        <YAxis tick={{fill:"#fff"}} />
        <Tooltip contentStyle={{ backgroundColor: "#8884d8", color: "#fff" }} itemStyle={{ color: "#fff" }} cursor={false}/>
        <Line type="monotone" dataKey="start_date" stroke="#8884d8" strokeWidth="5" dot={{fill:"#2e4355",stroke:"#8884d8",strokeWidth: 2,r:5}} activeDot={{fill:"#2e4355",stroke:"#8884d8",strokeWidth: 5,r:10}} />
        
      </LineChart>
    </ResponsiveContainer>
   
  </>
  );
}

export default Rechart;