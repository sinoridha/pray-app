const ontime = require("ontime");
const { nativeImage } = require("electron");
const prayTime = require("./PrayTimes");
const moment = require("moment");
const schedule = require('node-schedule');
const remote = require('electron').remote;
const app = remote.app;

moment.locale('id');

let icon = nativeImage.createFromPath('/usr/local/var/www/pray-app/build/background.png');
icon = icon.resize({width:64,height:64});
console.log('Size icon',icon.getSize());

let today = null;
if (today == undefined) {
  today = moment();
}

const list = [];
list["fajr"] = "Subuh";
list["sunrise"] = "Shuruq";
list["dhuhr"] = "Dhuhur";
list["asr"] = "Ashar";
list["maghrib"] = "Magrib";
list["isha"] = "Isha";
//list["now"] = "Sekarang";

document.addEventListener("DOMContentLoaded", () => {
  let n = new Notification("Welcom to Pray App (beta)", {
		icon: icon,
		body: "Please give feedback to sinoridha@gmail.com"
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
  times = getPrayTime();

  console.log('times',times);
  Object.keys(times).forEach(function(key,index) {
    const now = moment().format("HH:mm");
    if (now == times[key] &&  list[key] != undefined) {
      const title = 'Time to Pray!';
      const text = list[key] + ' has come!';
      let n = new Notification(title, {
        body: text,
        icon: icon
      });
    } else {
      console.log('check '+ key + ' not match now: '+ now + ' & time: ' + times[key]);
    }

  });
}

function getPrayTime() {
  var date = new Date(); // today
  prayTime.prayTimes.setMethod("Egypt");
  var times = prayTime.prayTimes.getTimes(date, [-6.1751, 106.865]);

  //times['now'] = "16:56";
  // Update display
  var html = '<table id="timetable" width="150" style="font-size:small;">';
  var month = []; // @todo : should use moment.js
  month[0] = "January";
  month[1] = "February";
  month[2] = "March";
  month[3] = "April";
  month[4] = "May";
  month[5] = "June";
  month[6] = "July";
  month[7] = "August";
  month[8] = "September";
  month[9] = "October";
  month[10] = "November";
  month[11] = "December";
  var days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  html += '<tr><th colspan="2">' + moment().format("dddd, Do MMMM YYYY") + "</th></tr>";

  for (var i in list) {
    html += "<tr><td align='left'>" + list[i] + "</td>";
    html += "<td align='right'>" + times[i] + "</td></tr>";
  }
  html += "</table>";
  document.getElementById("table").innerHTML = html;

  return times;
}

global.closeApp = function () {
	app.quit()
}
