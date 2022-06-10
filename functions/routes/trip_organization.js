const express = require('express');
const orgModel = require("../models/org.js")
const fs = require('fs');
const admin = require('firebase-admin');
const { Parser } = require('json2csv');


const router = express.Router();
const json2csvParser = new Parser({ header: true });

router.get('/all_organization', async function (req, res) {

    try {
        const db = admin.database();
        let formattedResponse = []
        await orgModel.aggregate([

            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "organisation",
                    as: "user_organization",

                },

            },

            { $match: { "user_organization.role": "teacher" } },

            {
                $project: {
                    name: 1, country: 1, city: 1, state: 1, zip: 1, contact: 1,
                    noOfTeachers: 1, "user_organization.role": 1, Number_of_student: 1, Number_of_teacher: 1

                }
            }
        ]).then((response) => {
            response.map((item) => {

                const noOfRole = item.user_organization.map(item => item.role).reduce((count, word) => {
                    count[word] = (count[word] || 0) + 1;
                    return count;
                }, {})

                formattedResponse.push({
                    Organization_Name: item.name,
                    Country: item.country,
                    City: item.city,
                    State: item.state,
                    ZipCode: item.zip,
                    Contact: item.contact,

                    Number_of_teacher: noOfRole.teacher,
                   Number_of_student: noOfRole.student,


                })
            })
        })
    const csvData = json2csvParser.parse(formattedResponse);
    
    fs.writeFile("Organizaation.csv", csvData, function(err) {
        if (err) console.log("Error generating csv", err)
    })
    
    const csvDataStream = []
    // Read file stream as Buffer from the generated csv from fs.writeFile
    fs.createReadStream("Organizaation.csv").on("error", function (error) {
      //callback that returns an error when there is an error
      console.log(error);
    }).on("data", function(row){
      // Push the data to a constant if there is a row
      csvDataStream.push(row)
    }).on("end", function(_) {
      // if csv is requested via query, returns csv else return the data as json
    
      if (req.query.csv == "true") {
        res.writeHead(200, { 
          'Content-Disposition': `attachment; filename="Organizaation.csv"`, 
          'Content-Type': 'text/csv'
        }).end(Buffer.concat(csvDataStream));
      } else {
        res.status(200).send({ results: formattedResponse, resultCount: formattedResponse.length, });
      }
    })
    } catch (err) {
    res.status(500).send({ message: 'Something went wrong ' + err.message });
    }
    })
    
    module.exports=router;
    
    
    
    
    
    

//             const csvData = json2csvParser.parse(formattedResposen);
//             fs.writeFile("Organizaation.csv", csvData, function (error) {
//                 if (error) res.status(500).send({ "error": error })
//                 res.send({ formattedResposen })
//             });
//         });
//     } catch (err) {
//         console.log(err)
//     };
// })




// module.exports = router;

