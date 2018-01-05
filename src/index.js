const ontime = require("ontime");
const { nativeImage } = require("electron");
const prayTime = require("./PrayTimes");
const moment = require("moment");
const schedule = require('node-schedule');
const remote = require('electron').remote;
const app = remote.app;

moment.locale('id');

document.addEventListener("DOMContentLoaded", () => {
	let base64Icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAOaSURBVFhH7ZhLyBZVHIfHsPICXjEStSxTBHNTCYGF4W0TkhAUGrQQxQu6MEFaaESibbqI2EWhUqxFCYWiEC7UEGkRpdQitShTMUorRS3TvDzPeed83/A67/jlOzML8QcP7/mf98yc35yZ+Z9zJsnR23AI+oaoHk2GP2B6iAo0Ai7BFVhiRU3aC/a5P0QFWg42PAlfW1GDhsNlOAH2/SC0lFdwAFaCjR3RquWdsq/n09+XIVcPgA1Wwbi0vBSqlrf3KHSD7+E7yNV80NRjYOPfYQdUqT7wH6wPUZK8Dnq4O0RN+hj+hjtDlCSb4RzcEaJq9CRo6LkQJclTYPxMiJr0G+xsFIMWgY0fDVE1eg3sY2iIkmQAmEXWhiiju8CGHhA1HqybG6Jq9Dk4MFn9BLsbxU49DpqZFaKG+oF1b4SoGh2GXY1ih7bBr41iQz5j74JmvoBPMlyEb+FeKFtTwNupyWyfP4JefD6D3gcrzqe//8KZtKxBT3IEekOR+sN2eCVExdKcb2/sU/4EE7blC2k5mNSMw9oDzOZ2Mhts6InmpGXny1aaBD9A7GwLxAc/T873GvDZfwc8Zgg4GB+CF+tAbYQwe+jekfSgNTARPMjn4yvwwPuhWdZ9CrY12U6FZeDIm7JWQE9oVpw9TG0e58B0h2NwHDaB/78EycMQ77tpZiAopzs7OgvzrMjoNngBzJO2eQu86qhHYA94TldGEyArTWvO/30hvDD1BGjYeu9qLwiKs8jYEHXqF7BhVj6LcdS+hKLJ3QTsjOTztsCKjFzOeY5XQ9SpF8H6e0KUqqsGbwdzlI+CI+xIXk+DII7mYitSVWLwTbDdwhB1XaYyk7Ij6W1UpRt0ynPk3gvR/5eJ/2dwptBw6QY/A9/MwSG6MTlT2c9MKNWgL4bJ80ZHL8qR86XZCqUaNBH7/7PQrpzOzLulGowzy0PQrkzenuu+9Ldtg9ZXSdsGZV0FfAClGIxvcdkqPc2UrVsG29Utg80aDc4Qq6FjHVegWg3OALcOrlY8j58vRkGRajPoAsBVzj4YCU/DaXC/a9xKtRgcA25u3JraYZRrPuu/gVaL2loMbgD3JHkjFTdG00J0rWoxeBCy33OychOVZyCqFoOn4KNGMVee0z1wnm4ug+57rfTtczEZccPuSjpbl8W3t8ig//t5I+/Yv8A+/8nUidsK64dBh/xC4CeH7EecruLnkVbyK0PeMdfD3WO3JEmSq5tktJgdMACBAAAAAElFTkSuQmCC";
	let icon = nativeImage.createFromDataURL(base64Icon);
	icon = icon.resize({width:43,height:43});
	console.log(icon.isEmpty());
	console.log(icon.toBitmap());
  let n = new Notification("Welcom to Pray App (beta)", {
		icon: icon.toBitmap(),
		body: "Please give feedback to sinoridha@gmail.com"
  });
});

setScedule();

setInterval(function() {
  setScedule();
}, 60 * 60 * 1000);

function setScedule() {
	console.log('scedule set')
  const times = getPrayTime();
  const ftimes = formatingDate(times);
  setNotificationSchedule(ftimes["fajr"], "Pray Time!", "It's fajr, let pray.");
	setNotificationSchedule(ftimes["dhuhr"], "Pray Time!", "It's dhuhr, let pray.");
	setNotificationSchedule(subtractInMinutes(ftimes["dhuhr"],5), "Pray Time will come soon!", "5 Minutes to Dhuhr.");
	setNotificationSchedule(ftimes["asr"], "Pray Time!", "It's asr, let pray.");
  setNotificationSchedule(subtractInMinutes(ftimes["asr"],5), "Pray Time will come soon!", "5 Minutes to Asr.");
	setNotificationSchedule(ftimes["maghrib"], "Pray Time!", "It's maghrib, let pray.");
	setNotificationSchedule(subtractInMinutes(ftimes["maghrib"],5), "Pray Time will come soon!", "5 Minutes to Maghrib.");
  setNotificationSchedule(ftimes["isha"], "Pray Time!", "It's isha, let pray.");
}

function subtractInMinutes(time, min){
	var d5 = moment(time, "YYYY-MM-DD HH:mm:ss");
	var newd5 = d5.subtract(min, 'minutes').format("YYYY-MM-DD HH:mm:ss");
	return newd5;
}

function getTimeBeforeMinutes(time, min){
	var MS_PER_MINUTE = 60000;
	var newTime = new Date(time - min * MS_PER_MINUTE);
	return newTime.getFullYear()+'-'+(newTime.getMonth()+1)+'-'+newTime.getDate()+' '+newTime.getHours()+':'+newTime.getMinutes+':'+newTime.getSeconds();
}

function formatingDate(times) {
  var newTime = [];
  Object.keys(times).forEach(function(key) {
    newTime[key] = formatDate() + " " + times[key] + ":00";
  });
  return newTime;
}

function formatDate() {
  var d = new Date(),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

function getPrayTime() {
  var date = new Date(); // today
  prayTime.prayTimes.setMethod("Egypt");
  var times = prayTime.prayTimes.getTimes(date, [-6.1751, 106.865]);

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

  var list = [];
  list["fajr"] = "Subuh";
  list["sunrise"] = "Shuruq";
  list["dhuhr"] = "Dhuhur";
  list["asr"] = "Ashar";
  list["maghrib"] = "Magrib";
  // list["midnight"] = "Tengah malam";
  for (var i in list) {
    html += "<tr><td align='left'>" + list[i] + "</td>";
    html += "<td align='right'>" + times[i] + "</td></tr>";
  }
  html += "</table>";
  document.getElementById("table").innerHTML = html;

  return times;
}

function setNotificationSchedule(time, title, text) {
	var mtime = moment(time, "YYYY-MM-DD HH:mm:ss");
	var YYYY = mtime.format('YYYY');
	var MM = mtime.format('M');
	var DD = mtime.format('DD');
	var HH = mtime.format('HH');
	var mm = mtime.format('mm');
	var ss = mtime.format('ss');
	var date = new Date(YYYY, (MM - 1), DD, HH, mm, ss);

	var j = schedule.scheduleJob(date, function(){
		let base64Icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAOaSURBVFhH7ZhLyBZVHIfHsPICXjEStSxTBHNTCYGF4W0TkhAUGrQQxQu6MEFaaESibbqI2EWhUqxFCYWiEC7UEGkRpdQitShTMUorRS3TvDzPeed83/A67/jlOzML8QcP7/mf98yc35yZ+Z9zJsnR23AI+oaoHk2GP2B6iAo0Ai7BFVhiRU3aC/a5P0QFWg42PAlfW1GDhsNlOAH2/SC0lFdwAFaCjR3RquWdsq/n09+XIVcPgA1Wwbi0vBSqlrf3KHSD7+E7yNV80NRjYOPfYQdUqT7wH6wPUZK8Dnq4O0RN+hj+hjtDlCSb4RzcEaJq9CRo6LkQJclTYPxMiJr0G+xsFIMWgY0fDVE1eg3sY2iIkmQAmEXWhiiju8CGHhA1HqybG6Jq9Dk4MFn9BLsbxU49DpqZFaKG+oF1b4SoGh2GXY1ih7bBr41iQz5j74JmvoBPMlyEb+FeKFtTwNupyWyfP4JefD6D3gcrzqe//8KZtKxBT3IEekOR+sN2eCVExdKcb2/sU/4EE7blC2k5mNSMw9oDzOZ2Mhts6InmpGXny1aaBD9A7GwLxAc/T873GvDZfwc8Zgg4GB+CF+tAbYQwe+jekfSgNTARPMjn4yvwwPuhWdZ9CrY12U6FZeDIm7JWQE9oVpw9TG0e58B0h2NwHDaB/78EycMQ77tpZiAopzs7OgvzrMjoNngBzJO2eQu86qhHYA94TldGEyArTWvO/30hvDD1BGjYeu9qLwiKs8jYEHXqF7BhVj6LcdS+hKLJ3QTsjOTztsCKjFzOeY5XQ9SpF8H6e0KUqqsGbwdzlI+CI+xIXk+DII7mYitSVWLwTbDdwhB1XaYyk7Ij6W1UpRt0ynPk3gvR/5eJ/2dwptBw6QY/A9/MwSG6MTlT2c9MKNWgL4bJ80ZHL8qR86XZCqUaNBH7/7PQrpzOzLulGowzy0PQrkzenuu+9Ldtg9ZXSdsGZV0FfAClGIxvcdkqPc2UrVsG29Utg80aDc4Qq6FjHVegWg3OALcOrlY8j58vRkGRajPoAsBVzj4YCU/DaXC/a9xKtRgcA25u3JraYZRrPuu/gVaL2loMbgD3JHkjFTdG00J0rWoxeBCy33OychOVZyCqFoOn4KNGMVee0z1wnm4ug+57rfTtczEZccPuSjpbl8W3t8ig//t5I+/Yv8A+/8nUidsK64dBh/xC4CeH7EecruLnkVbyK0PeMdfD3WO3JEmSq5tktJgdMACBAAAAAElFTkSuQmCC";
		let icon = nativeImage.createFromDataURL(base64Icon);
		icon = icon.resize({width:43,height:43});
		console.log(icon.isEmpty());
		console.log(icon.toBitmap());
		let n = new Notification(title, {
      body: text,
      icon: icon
    });
	});
}

global.closeApp = function () {
	app.quit()
}
