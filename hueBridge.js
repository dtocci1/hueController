//import 'regenerator-runtime/runtime';
import axios from 'axios'
var nhue = 1000;
var date = new Date();
var curTime = date.toLocaleTimeString('en-US', { hour12: false, 
    hour: "numeric", 
    minute: "numeric",
    second: "numeric"});
const args = process.argv;


const test = async () => {
    const url = `http://192.168.1.40/api/x5hiH45E0-Gc94cj-G81LqOp43xgc54-bPtEQEsG/lights/1/state`;
    try {
        return await axios.put(url, {
            hue: nhue,
        });
    } catch (err) {
        console.error(err + "\t: %s", curTime);
    }
};


switch(args[2]) {
    case "flash":
        break;
    case "rainbow":
        break;
    case "test":
        try{
            var duration = parseInt(args[3]);
        }
        catch(err) {
            console.log(err);
        }

        for(var i = 0;i <duration;i++) {
            test();
            nhue = (nhue + 2000) % 65535;
            console.log(nhue + "\t %s", curTime);
        }

        break;
    case "help":
        console.log("Please enter one of the following commands:");
        break;
    default:
        break;
} 


