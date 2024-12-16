// import dotenv from 'dotenv';
// dotenv.config();

import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
const app=express();
import mysql from 'mysql2';
import cors from 'cors';
import bodyParser from'body-parser';
import axios from'axios';
const PORT =process.env.PORT || 5000;

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// ...

function formatDateForMySQL(inputDate) {
  const parts = inputDate.split(" "); // Split date and time
  const dateParts = parts[0].split("-"); // Split date into day, month, year
  const timeParts = parts[1].split(":"); // Split time into hours, minutes, seconds

  const year = parseInt(dateParts[2]);
  const month = parseInt(dateParts[1]) - 1; // Months in JavaScript are 0-based
  const day = parseInt(dateParts[0]);
  const hours = parseInt(timeParts[0]);
  const minutes = parseInt(timeParts[1]);
  const seconds = parseInt(timeParts[2]);

  return new Date(year, month, day, hours, minutes, seconds);
}


function fetchAndStoreData() {

  console.log('entered into fetch function');

  const apiUrl = `${process.env.API_BASE_URL}?userId=${process.env.API_USER_ID}&apiKey=${process.env.API_KEY}`;

  axios
    .get(apiUrl)
    .then((response) => {
      const responseData = response.data;

      if (responseData && Array.isArray(responseData[0].vehicleLocations)) {
        const vehicleLocations = responseData[0].vehicleLocations;

        // Iterate over the vehicleLocations array and extract the required information
        for (const location of vehicleLocations) {
          const {
            rowId,
            latitude,
            longitude,
            speed,
            date,
            alert,
            direction,
            position,
            distanceCovered,
            odoDistance,
            odoMeterDevice,
            tankSize,
            deviceVolt,
            status,
            altitude,
            color,
            lastSeen,
            ignitionStatus,
            insideGeoFence,
            isOverSpeed,
            address,
            parkedTime,
            movingTime,
            idleTime,
            noDataTime,
            alertDateTime,
            latLngOld,
            loadTruck,
            loadTrailer,
            totalTruck,
            totalTrailer,
            vehicleBusy,
            fuelLitre,
            temperature,
            powerStatus,
            deviceStatus,
            gsmLevel,
            startParkedTime,
            endParkedTime,
            maxSpeed,
            averageSpeed,
            lastComunicationTime,
            isOutOfOrder,
            tripName,
            forwardOrBackward,
            enableLog,
            dateSec,
            digitalInput3,
            fuelSensorVolt,
            nTankSize,
            noOfTank,
            sensorCount,
            gpsSimICCID,
            madeIn,
            manufacturingDate,
            chassisNumber,
            gpsSimNo,
            onboardDate,
            speedInfo,
            defaultMileage,
            noDataStatus,
            lat,
            lng,
            topSpeed,
            fuelSensorType,
            idleEndDate,
            todayWorkingHours,
            fuelLitres,
            vehicleMake,
            oprName,
            regNo,
            vehicleType,
            vehicleId,
            mobileNo,
            customMarker,
            deviceModel,
            shortName,
            orgId,
            overSpeedLimit,
            driverName,
            error,
            live,
            fuel,
            deviceId,
            expired,
            expiryDate,
            routeName,
            expiryDays,
            groupName,
            safetyParking,
            description,
            driverMobile,
            vehicleName,
            trackName,
            report,
            licenceExpiry,
            supportDetails,
            serial1,
            expiryStatus,
            vehicleMode,
            vehicleModel,
            licenceType,
            licenceExpiryStatus,
            rigMode,
            vehicleList,
            userId,
            macid,
            appid,
            group_name,
            language,
            immobilizer,
            timeZone,
            calibrateMode,
            engineStatus,
            communicatingPortNo,
            isAsset,
            vehicleTypeLabel,
            expectedFuelMileage,
            immobilizerStatus,
            fcode,
            ac,
            cameraEnabled
          } = location;

          const insertQuery = `INSERT INTO vehicle_data_sgrmc (
            rowId,
            latitude,
            longitude,
            speed,
            date,
            alert,
            direction,
            position,
            distanceCovered,
            odoDistance,
            odoMeterDevice,
            tankSize,
            deviceVolt,
            status,
            altitude,
            color,
            lastSeen,
            ignitionStatus,
            insideGeoFence,
            isOverSpeed,
            address,
            parkedTime,
            movingTime,
            idleTime,
            noDataTime,
            alertDateTime,
            latLngOld,
            loadTruck,
            loadTrailer,
            totalTruck,
            totalTrailer,
            vehicleBusy,
            fuelLitre,
            temperature,
            powerStatus,
            deviceStatus,
            gsmLevel,
            startParkedTime,
            endParkedTime,
            maxSpeed,
            averageSpeed,
            lastComunicationTime,
            isOutOfOrder,
            tripName,
            forwardOrBackward,
            enableLog,
            dateSec,
            digitalInput3,
            fuelSensorVolt,
            nTankSize,
            noOfTank,
            sensorCount,
            gpsSimICCID,
            madeIn,
            manufacturingDate,
            chassisNumber,
            gpsSimNo,
            onboardDate,
            speedInfo,
            defaultMileage,
            noDataStatus,
            lat,
            lng,
            topSpeed,
            fuelSensorType,
            idleEndDate,
            todayWorkingHours,
            fuelLitres,
            vehicleMake,
            oprName,
            regNo,
            vehicleType,
            vehicleId,
            mobileNo,
            customMarker,
            deviceModel,
            shortName,
            orgId,
            overSpeedLimit,
            driverName,
            error,
            live,
            fuel,
            deviceId,
            expired,
            expiryDate,
            routeName,
            expiryDays,
            groupName,
            safetyParking,
            description,
            driverMobile,
            vehicleName,
            trackName,
            report,
            licenceExpiry,
            supportDetails,
            serial1,
            expiryStatus,
            vehicleMode,
            vehicleModel,
            licenceType,
            licenceExpiryStatus,
            rigMode,
            vehicleList,
            userId,
            macid,
            appid,
            group_name,
            language,
            immobilizer,
            timeZone,
            calibrateMode,
            engineStatus,
            communicatingPortNo,
            isAsset,
            vehicleTypeLabel,
            expectedFuelMileage,
            immobilizerStatus,
            fcode,
            ac,
            cameraEnabled
          ) VALUES (
            ${db.escape(rowId)},
            ${db.escape(latitude)},
            ${db.escape(longitude)},
            ${db.escape(speed)},
            ${db.escape(date)},
            ${db.escape(alert)},
            ${db.escape(direction)},
            ${db.escape(position)},
            ${db.escape(distanceCovered)},
            ${db.escape(odoDistance)},
            ${db.escape(odoMeterDevice)},
            ${db.escape(tankSize)},
            ${db.escape(deviceVolt)},
            ${db.escape(status)},
            ${db.escape(altitude)},
            ${db.escape(color)},
            ${db.escape(formatDateForMySQL(lastSeen))},
            ${db.escape(ignitionStatus)},
            ${db.escape(insideGeoFence)},
            ${db.escape(isOverSpeed)},
            ${db.escape(address)},
            ${db.escape(parkedTime)},
            ${db.escape(movingTime)},
            ${db.escape(idleTime)},
            ${db.escape(noDataTime)},
            ${db.escape(alertDateTime)},
            ${db.escape(latLngOld)},
            ${db.escape(loadTruck)},
            ${db.escape(loadTrailer)},
            ${db.escape(totalTruck)},
            ${db.escape(totalTrailer)},
            ${db.escape(vehicleBusy)},
            ${db.escape(fuelLitre)},
            ${db.escape(temperature)},
            ${db.escape(powerStatus)},
            ${db.escape(deviceStatus)},
            ${db.escape(gsmLevel)},
            ${db.escape(startParkedTime)},
            ${db.escape(endParkedTime)},
            ${db.escape(maxSpeed)},
            ${db.escape(averageSpeed)},
            ${db.escape(lastComunicationTime)},
            ${db.escape(isOutOfOrder)},
            ${db.escape(tripName)},
            ${db.escape(forwardOrBackward)},
            ${db.escape(enableLog)},
            ${db.escape(dateSec)},
            ${db.escape(digitalInput3)},
            ${db.escape(fuelSensorVolt)},
            ${db.escape(nTankSize)},
            ${db.escape(noOfTank)},
            ${db.escape(sensorCount)},
            ${db.escape(gpsSimICCID)},
            ${db.escape(madeIn)},
            ${db.escape(manufacturingDate)},
            ${db.escape(chassisNumber)},
            ${db.escape(gpsSimNo)},
            ${db.escape(onboardDate)},
            ${db.escape(speedInfo)},
            ${db.escape(defaultMileage)},
            ${db.escape(noDataStatus)},
            ${db.escape(lat)},
            ${db.escape(lng)},
            ${db.escape(topSpeed)},
            ${db.escape(fuelSensorType)},
            ${db.escape(idleEndDate)},
            ${db.escape(todayWorkingHours)},
            ${db.escape(fuelLitres)},
            ${db.escape(vehicleMake)},
            ${db.escape(oprName)},
            ${db.escape(regNo)},
            ${db.escape(vehicleType)},
            ${db.escape(vehicleId)},
            ${db.escape(mobileNo)},
            ${db.escape(customMarker)},
            ${db.escape(deviceModel)},
            ${db.escape(shortName)},
            ${db.escape(orgId)},
            ${db.escape(overSpeedLimit)},
            ${db.escape(driverName)},
            ${db.escape(error)},
            ${db.escape(live)},
            ${db.escape(fuel)},
            ${db.escape(deviceId)},
            ${db.escape(expired)},
            ${db.escape(expiryDate)},
            ${db.escape(routeName)},
            ${db.escape(expiryDays)},
            ${db.escape(groupName)},
            ${db.escape(safetyParking)},
            ${db.escape(description)},
            ${db.escape(driverMobile)},
            ${db.escape(vehicleName)},
            ${db.escape(trackName)},
            ${db.escape(report)},
            ${db.escape(licenceExpiry)},
            ${db.escape(supportDetails)},
            ${db.escape(serial1)},
            ${db.escape(expiryStatus)},
            ${db.escape(vehicleMode)},
            ${db.escape(vehicleModel)},
            ${db.escape(licenceType)},
            ${db.escape(licenceExpiryStatus)},
            ${db.escape(rigMode)},
            ${db.escape(vehicleList)},
            ${db.escape(userId)},
            ${db.escape(macid)},
            ${db.escape(appid)},
            ${db.escape(group_name)},
            ${db.escape(language)},
            ${db.escape(immobilizer)},
            ${db.escape(timeZone)},
            ${db.escape(calibrateMode)},
            ${db.escape(engineStatus)},
            ${db.escape(communicatingPortNo)},
            ${db.escape(isAsset)},
            ${db.escape(vehicleTypeLabel)},
            ${db.escape(expectedFuelMileage)},
            ${db.escape(immobilizerStatus)},
            ${db.escape(fcode)},
            ${db.escape(ac)},
            ${db.escape(cameraEnabled)}
          )`;
        
          db.query(insertQuery, (error) => {
            if (error) {
              console.error('Error inserting data into the database:', error);
            } else {
              console.log('Data inserted successfully');
            }
          });

        }
      }
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
}
setInterval(()=>fetchAndStoreData(), 30000);
app.listen(PORT,(req,res)=>{
    console.log('Server running on PORT ');
    // res.send('HI');
})
