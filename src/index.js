const fs = require('fs');

const ontime = require("ontime");
const { nativeImage } = require("electron");
const prayTime = require("./PrayTimes");
const moment = require("moment");
const schedule = require('node-schedule');
const remote = require('electron').remote;
const app = remote.app;
const { dialog } = require('electron')
moment.locale('id');

// let icon = nativeImage.createFromPath('./build/background.png');
let icon = nativeImage.createFromPath('/Users/ridha/workspace/pray-app/build/trayIcon.png');
icon = icon.resize({width:64,height:64});
console.log('Size icon',icon.getSize());

let today = null;
if (today == undefined) {
  today = moment();
}


global.setting = openConfig();
function openConfig() {
  const filePath = app.getPath('home') + '/zikir-indonesia-setting.json';
  console.log('filePath', filePath)

  try {
    let rawdata = fs.readFileSync(filePath);
    return setting = JSON.parse(rawdata);
  } catch(err) {
    console.log('Error open file : ', err);
    const options = {
      type: 'error',
      buttons: ['Closed'],
      title: 'Error',
      // message: err.message,
      message: 'File setting tidak tersedia',
      detail: 'Lokasi seting file: ' + filePath,
    };
    remote.dialog.showMessageBox(null, options, (response, checkboxChecked) => {
      console.log(checkboxChecked);
    });
  }
}

const list = [];
list["bffajr"] = "5 minutes before Subuh";
list["fajr"] = "Subuh";
list["sunrise"] = "Shuruq";
list["bfdhuhr"] = "5 minutes before Dhuhur";
list["dhuhr"] = "Dhuhur";
list["bfasr"] = "5 minutes before Ashar";
list["asr"] = "Ashar";
list["bfmaghrib"] = "5 minutes before Magrib";
list["maghrib"] = "Magrib";
list["bfisha"] = "5 minutes before Isha";
list["isha"] = "Isha";
// list["bfnow"] = "Sekarang";

document.addEventListener("DOMContentLoaded", () => {
  let n = new Notification("Welcome to Zikir Indonesia (beta)", {
		icon: icon,
    body: "Zikir Indonesia is now available on your tray.\nPlease give feedback to sinoridha@gmail.com.",
    action: {type: 'button', text: 'wow'}
  });
});
checkTime();

ontime({
  cycle: [ '00' ]
}, function (ot) {
  console.log('Ontime Interval');
  checkTime() ;
  ot.done()
  return;
})


function checkTime() {
  let times = getPrayTime();
  console.log('times',times);

  updateTimeTable(times);

  let newTime = addBeforeRemainder(times)
  // newTime['bfnow'] = '16:01';
  console.log('times with remainder',newTime);

  Object.keys(newTime).forEach(function(key,index) {
    const now = moment().format("HH:mm");
    if (now == newTime[key] &&  list[key] != undefined) {
      console.log('check '+ key + ' is match now: '+ now + ' & time: ' + newTime[key]);
      let title = 'Time to Pray!';
      let text = 'It is ' + list[key] + ' time';
      console.log('key.startsWith(bf)',key.startsWith('bf'));
      if (key.startsWith('bf')) {
        title = 'Pray time will come soon!';
        text = 'It is ' + list[key];
      }
      let n = new Notification(title, {
        body: text,
        icon: icon
      });
    } else {
      console.log('check '+ key + ' not match now: '+ now + ' & time: ' + newTime[key]);
    }

  });
}

function getPrayTime() {
  // Setup Config Pray Time adjustment
  var date = new Date(); // today
  prayTime.prayTimes.setMethod("Egypt");
  prayTime.prayTimes.adjust({ fajr: 20, asr: 'Standard', isha: 18 });
	prayTime.prayTimes.tune({
		fajr: 2, sunrise: -2, dhuhr: 3, asr: 2, maghrib: 2, isha: 2
	});
  // define latitude longitued
  // -6.190358,106.8233313 //sinar mas land
  // var times = prayTime.prayTimes.getTimes(date, [-6.190358, 106.8233313]);
  var times = prayTime.prayTimes.getTimes(date, [setting.latitude, setting.longitude]);
  return times;
}

function addBeforeRemainder(times) {
  console.log('time in addBeforeRemainder', times);
  let newTime = Object.assign({},times);
  const minBefore = 5;
  Object.keys(times).forEach(function(key,index) {
    var time = moment(times[key],'hh:mm');
    var notifTime = time.subtract(minBefore,'minutes')
    newTime['bf'+key] = notifTime.format('HH:mm');
  });
  return newTime;
}

function updateTimeTable(times) {
  const willDisplay = ['fajr','sunrise','dhuhr','asr','maghrib','isha'];

  var html = '<table id="timetable" width="160" style="font-size:small;">';
  html += '<tr><th colspan="2">' + moment().format("dddd, Do MMMM YYYY") + "</th></tr>";

  for (var i in list) {
    if (willDisplay.includes(i)) {
      html += "<tr><td align='left'>" + list[i] + "</td>";
      html += "<td align='right'>" + times[i] + "</td></tr>";
    }
  }
  html += "</table>";
  document.getElementById("table").innerHTML = html;
}

global.closeApp = function () {
	app.quit()
}
