const express = require('express');
const Trip = require("../models/tripModel")
const fs = require('fs');
const admin = require('firebase-admin');
const { Parser } = require('json2csv');


const router = express.Router();
const json2csvParser = new Parser({ header: true });

router.get('/all_chart', async function (req, res) 
{
try 
{

        
    await Trip.aggregate([
        //  {$unwind: "$trip_leader"},
        {
            $lookup:
            {
      
                from: "users",
                localField: "trip_leader",//for trip
                foreignField: "_id",//for user
                as: "TripLeaderID"
            }
        },
       // {$unwind: "$trip_leader"}
     
      
        {
            $lookup:
            {
                from: "organisations",
                localField: "organisation",
                foreignField: "_id",
                as: "OrganizationID"
            }
        },
     
      
        { $unwind: "$OrganizationID" },
        { $unwind: "$TripLeaderID" },
        //  {$unwind: "$trip_itinerary"},
      
      
        {
            $project: {

           no_of_trips: { $size: "$TripLeaderID._id" }, 
             
                name: 1, start_date: 1, trip_itinerary: 1, _id: 1, end_date: 1, created_at: 1, 
                updatedAt: 1, no_of_trips:1
               
            }
        }
      
      ])
        .then((response) => 
        {
           // console.log("here")
            const formattedResposen = [];
            response.map((item) => {
                // console.log(item)
                formattedResposen.push({
                   id: item._id,
                    name: item.name,
                   
                    start_date: new Date(item.start_date).getFullYear(),
                    
                   // End_time: new Date(item.end_date).toLocaleTimeString(),
  
                
                   // No_of_trips: item.no_of_trips,
      
                })
            })
              
            res.send({ data: formattedResposen });
    })  
} catch (err) {
  res.status(500).send({ message: 'Something went wrong ' + err.message });
}
})


      
   
    
    module.exports=router;
    
    