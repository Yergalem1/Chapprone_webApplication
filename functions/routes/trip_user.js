const express = require('express');
const userModel = require("../models/userModel.js") 
const fs = require('fs');
const admin =require('firebase-admin');
const { Parser } = require('json2csv');


const router = express.Router();
const json2csvParser = new Parser({ header: true });


router.get('/all_users', async function (req, res) {
//  user list with  organization info  and number of trips user attended 
    try {
        const db = admin.database();
        await userModel.aggregate([
            {
                $lookup:
                {
                    from: "organisations",
                    localField: "organisation",
                    foreignField: "_id",
                    as: "OrganizationID"
                }
            },
            {
                $lookup:
                {
                    from: "participants",
                    localField: "_id",
                    foreignField: "user_id",
                    as: "Trip_participant"
                }
            }
            ,
            { $unwind: "$OrganizationID" },
    
            {
                $project: {
                    no_of_trips: { $size: "$Trip_participant.user_id" }, "first_name": 1,
                    "last_name": 1, "email": 1, "role": 1, "_id": 0, "created_at": 1, "Organization_Name": "$OrganizationID.name"
                }
            },
        ]).then((response) => 
        {
          console.log("here")
          const formattedResponse = [];
          response.map((item) => {
              // console.log(item)
              formattedResponse.push({
                  FirstName: item.first_name,
                  LastName: item.last_name,
                  Email: item.email,  
                  Role: item.role,
                  Created_at: item.created_at,
                  Organization: item.Organization_Name,
                  Number_Of_Trips: item.no_of_trips
              })
          })
          const csvData = json2csvParser.parse(formattedResponse);
          fs.writeFile("Users_List.csv", csvData, function(err) {
            if (err) console.log("Error generating csv", err)
          })
        
          const csvDataStream = []
          // Read file stream as Buffer from the generated csv from fs.writeFile
          fs.createReadStream("Users_List.csv").on("error", function (error) {
            //callback that returns an error when there is an error
            console.log(error);
          }).on("data", function(row){
            // Push the data to a constant if there is a row
            csvDataStream.push(row)
          }).on("end", function(_) {
            // if csv is requested via query, returns csv else return the data as json

            if (req.query.csv == "true") {
              res.writeHead(200, { 
                'Content-Disposition': `attachment; filename="Users_List.csv"`, 
                'Content-Type': 'text/csv'
              }).end(Buffer.concat(csvDataStream));
            } else {
              res.status(200).send({ results: formattedResponse, resultCount: formattedResponse.length, });
            }
          })
    })
  } catch (err) {
    res.status(500).send({ message: 'Something went wrong ' + err.message });
  }
})

module.exports=router;





