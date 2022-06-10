const express = require('express');
const Trip = require("../models/tripModel.js") 
const fs = require('fs');
const admin =require('firebase-admin');
const { Parser } = require('json2csv');
const fastCsv = require('fast-csv');


const router = express.Router();
const json2csvParser = new Parser({ header: true });


router.get('/all_trips', async function (req, res) {

  // Trip list with  trip lider information, number of broadcasts, number of chat messages, number of iiinerary entries, trip duration and number of suudent and number of teacher 

  try {
      const db = admin.database();
      let formattedResponse = []
      await Trip.aggregate([
          {
              $lookup:
              {
                  from: "users",
                  localField: "trip_leader",//for trip
                  foreignField: "_id",//for user
                  as: "tripLeader"
              }
          },
          {
            $lookup: {
              from: "participants",
              as: "trip_participants",
              let: { id: "$_id" },
              pipeline: [
                {
                  $match: { 
                    $expr: { $eq: ["$$id", "$trip_id"] },
                   
                  } 
                },
                {
                  $unset: "trip_id"
                },
                {
                  $addFields: {
                    "participant_id": "$id"
                  }
                },
                {
                  $unset: "id"
                },
                {
                  $lookup: {
                    from: "users",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "participant_user_info"
                  }
                },
                {
                  $unwind: "$participant_user_info"
                },
                {
                  $unset: "user_id"
                },
                {
                  $group: {
                    _id: "$participant_user_info.role",
                    data: {
                      $push: "$$ROOT"
                    }
                  }
                },
                {
                  $group: {
                    _id: null,
                    "data": {
                      $push: {
                        k: "$_id",
                        v: "$data"
                      }
                    }
                  }
                },
                {
                  $replaceRoot: {
                    newRoot: {
                      "$arrayToObject": "$data"
                    }
                  }
                },
                {
                  $project: {
                    student: {
                      $cond: {
                        if: {
                          $isArray: "$student"
                        },
                        then: {
                          $size: "$student"
                        },
                        else: "NA"
                      }
                    },
                    teacher: {
                      $cond: {
                        if: {
                          $isArray: "$teacher"
                        },
                        then: {
                          $size: "$teacher"
                        },
                        else: "NA"
                      }
                    },
                    
                  }
                }
              ]
            },
            
          },
          {
            $lookup: {
              from: "organisations",
              localField: "organisation",
              foreignField: "_id",
              as: "organisation",
              
            }
          },
          {$unwind: "$tripLeader"},
          {
            $unwind: "$organisation"
          },
          {
            $unwind: "$trip_participants"
          },
          {
            $addFields: {
              "trip_org_name": "$organisation.name"
            }
          },
          {
            $unset: "organisation"
          },
          {
            $addFields: {}
          } ,
          {
            $addFields: {
              Trip_Duration: {
                $round: {
                  $divide: [
                    {
                      $subtract: [
                        "$end_date",
                        "$start_date"
                      ]
                    },
                    86400000
                  ]
                }
              }
            }
          },
          {
            $project: {
                
                name: 1, 
                start_date: 1, 
                _id: 1, 
                end_date: 1, 
                created_at: 1,
                  updatedAt: 1,
                  trip_itinerary_Number: { $size: "$trip_itinerary"},
                  "trip_participants.teacher":1,
                  "trip_participants.student":1,
                  "trip_org_name": 1,
                  "Trip_Duration": 1,
                  tripLeaderFirstName: "$tripLeader.first_name",
                  tripLeaderLastName: "$tripLeader.last_name",
                  tripLeaderEmail: "$tripLeader.email",
            }
          },
        ]).then((response) => {
        
            formattedResponse = response.map((item) => {
               
                return {
                    _id: item._id,
                    Name: item.name,
                //    Description: item.description,
                    Number_Of_Teacher:item.trip_participants.teacher,
                    Number_Of_Student:item.trip_participants.student,
                    Created_at:item.created_at,
                    UpdatedAt:item.updatedAt,
                    Start_date: new Date(item.start_date).toLocaleDateString(),
                    End_date: new Date(item.end_date).toLocaleDateString(),
                    Start_time: new Date(item.start_date).toLocaleTimeString(),
                    End_time: new Date(item.end_date).toLocaleTimeString(),
                    Trip_Duration :item.Trip_Duration,
                    Organization_Name: item.trip_org_name,
                    Number_Of_Trip_Itinerary:item.trip_itinerary_Number,
                    tripLeaderFirstName: item.tripLeaderFirstName,
                    tripLeaderLastName: item.tripLeaderLastName,
                    tripLeaderEmail: item.tripLeaderEmail
                 
                }
            });
          });
      
      const ref = db.ref('/chapperones_broadcasts');
      const message_ref = db.ref('/messages');
      let broadcasts={};
      let messages = {}
      // fetch broadcasts information by tripId
      await ref.once(
          'value',
          snapshot => {
          broadcasts = snapshot.val();
          },
          errorObject => {
              console.log('The read failed: ' + errorObject.name);
          },
      );

      // fetch messages information
      await message_ref.once(
          'value',
          snapshot => {
          messages = snapshot.val();
          },
          errorObject => {
              console.log('The read failed: ' + errorObject.name);
          },
      );


      // Map through all trips and get the broadcast count for each trips

      const finalResults = formattedResponse.map(trip => {
          const _id = trip._id.toString();
          const trips = broadcasts[_id] || {};

          // get all values of trip broadcasts
          const broadcastsValues = Object.values(trips);
          //count number of message pre trip
          const messageTrips = Object.keys(Object.values(Object.values(messages[_id] || {})[0] || {})[0] || {}).length
         //count number of broadcast per trip
          trip.broadcastsCount = broadcastsValues.length
          trip.messageCount = messageTrips;
          return trip;
      })
      
      const csvData = json2csvParser.parse(finalResults);
      fs.writeFile("Trip_With_Trip_Leader.csv", csvData, function(err) {
          if (err) console.log("Error generating csv", err)
      })

      const csvDataStream = []
      // Read file stream as Buffer from the generated csv from fs.writeFile
      fs.createReadStream("Trip_With_Trip_Leader.csv").on("error", function (error) {
        //callback that returns an error when there is an error
        console.log(error);
      }).on("data", function(row){
        // Push the data to a constant if there is a row
        csvDataStream.push(row)
      }).on("end", function(_) {
        // if csv is requested via query, returns csv else return the data as json

        if (req.query.csv == "true") {
          res.writeHead(200, { 
            'Content-Disposition': `attachment; filename="Trip_With_Trip_Leader.csv"`, 
            'Content-Type': 'text/csv'
          }).end(Buffer.concat(csvDataStream));
        } else {
          res.status(200).send({ results: finalResults, resultCount: finalResults.length, });
        }
      })
  } catch (err) {
      res.status(500).send({ message: 'Something went wrong ' + err.message });
  }
})

module.exports=router;

