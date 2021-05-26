/*
    * File: hueBridge.js
    * Author: Dylan Tocci
    * Version: 1.0
    * Description:
    *   This program allows the user to control light bulb (1 tentatively) through bash.
    *   The user can set all paramters for the bulb in addition to fetching its current state.
    * 
    * TO DO:
    *   - Allow for changing IP
    *   - Add HTML frontend?
*/

import axios from 'axios'
import fs from 'fs'

// Light parameters
var nhue = 1000;
var state = false;
var brightness = 0;
var saturation = 0;
var color = "white"; // default color

// Debug parameters
var date = new Date();
var curTime = date.toLocaleTimeString('en-US', { hour12: false, 
    hour: "numeric", 
    minute: "numeric",
    second: "numeric"});
const args = process.argv;

// Adjustable URL -- should be adjustable
const url = `http://192.168.1.4/api/x5hiH45E0-Gc94cj-G81LqOp43xgc54-bPtEQEsG/lights/1/state`; // this might change dynamically?

const setPower = async () => {
    try {
        return await axios.put(url, {
            on:state
        });
    } catch (err) {
    console.error(err + "\t: %s", curTime);
    }
}

const setHue = async () => {
    try {
        return await axios.put(url, {
            hue: nhue,
        });
    } catch (err) {
        console.error(err + "\t: %s", curTime);
    }
};

const setBrightness = async () => {
    try {
        return await axios.put(url, {
            bri: brightness,
        });
    } catch (err) {
        console.error(err + "\t: %s", curTime);
    }
};

const setSaturation = async () => {
    try {
        return await axios.put(url, {
            sat: saturation,
        });
    } catch (err) {
        console.error(err + "\t: %s", curTime);
    }
};

function setColor() {
    //var file = require('fs');
    try {
        var data = fs.readFileSync('huePresets.txt','utf8');
        data = data.toString(); // convert to string

        // parse string based on color
        var dataArray = data.split('\n');

        for(var i=0; i<dataArray.length; i++)
        {
            if (dataArray[i].includes(color.toLowerCase()))
            {   
                var parameters = dataArray[i].split(' ');
                nhue = parseInt(parameters[1]);
                saturation = parseInt(parameters[2]);
                setSaturation();
                setHue();
            }
        }

        
    } catch(err) {
        console.error(err);
    }
};



async function getState() {
    let res = await axios.get(url.replace("/state",""));
    let data = res.data;
    console.log(data);
  }
  

// ************************************************************************
// **************************** HANDLE INPUT ******************************
// ************************************************************************

switch(args[2]) 
{
    case "setPower":
        if (args[3].toLowerCase() == "on" || args[3].toLowerCase() == "true")
            state = true;
        else if (args[3].toLowerCase() == "off" || args[3].toLowerCase() == "false")
            state = false;
        else
        {
            console.log("ERROR: Light power must be on or off (true or false)");
            break;
        }

        setPower();
        break;


    case "setHue":
        try{
            nhue = parseInt(args[3]);
        } catch {
            console.log("ERROR: Input must be a valid number"); // parseInt seems to prevent this on its own
        }

        if (nhue > 65535 || nhue < 0)
        {
            console.log("ERROR: Input must be within range [0, 65535]");
            break;
        }

        setHue();
        break;
        

    case "setBrightness":
        try{
            brightness = parseInt(args[3]);
        } catch {
            console.log("ERROR: Input must be a valid number"); // parseInt seems to prevent this on its own
        }

        if (brightness > 254 || brightness < 0)
        {
            console.log("ERROR: Input must be within range [0, 254]");
            break;
        }

        setBrightness();
        break;
    
    case "setSaturation":
        try{
            saturation = parseInt(args[3]);
        } catch {
            console.log("ERROR: Input must be a valid number"); // parseInt seems to prevent this on its own
        }

        if (saturation > 254 || saturation < 0)
        {
            console.log("ERROR: Input must be within range [0, 254]");
            break;
        }

        setSaturation();
        break;

    case "setHBS":
        try {
            nhue = parseInt(args[3]);
            brightness = parseInt(args[4]);
            saturation = parseInt(args[5]);
        } catch {
            console.log("ERROR: Input was goofed. Too lazy to figure out what part.");
        }

        setSaturation();
        setHue();
        setBrightness();
        break;

    case "setColor":
        color = args[3];
        setColor();
        break;

    case "getState":
        getState();
        break;

    case "help":
        console.log("Please enter one of the following commands:" +
                    "\n\t setPower" +
                    "\n\t setHue" +
                    "\n\t setBrightness" +
                    "\n\t setSaturation" +
                    "\n\t setHBS" +
                    "\n\t getState");
        break;

    default:
        console.log("ERROR: Command not found. Please type help for valid commands");
        break;
} 


