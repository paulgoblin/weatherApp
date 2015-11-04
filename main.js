'use strict'

var apiUrl = 'http://api.wunderground.com/api/f06eca0725e8a51c/';
var zipCode = $('#zipInput').val();
var rawData ;
var rawHourly;
var rawGeo;
var weatherData ;


$(document).ready(init);

function init() {


  $('#getWeather').click(getWeather);
  $('#getLocation').click(getLocation);


}

function getLocation (e) {
  $.get("http://ipinfo.io", function(response) {
      $('#zipInput').val(response.postal);
  }, "jsonp");
}

function getWeather(e){
  rawData = undefined;
  rawHourly = undefined;
  rawGeo = undefined;
  zipCode = $('#zipInput').val();

  var url = apiUrl + 'forecast/q/'+ zipCode +'.json';

  $.get(url)
  .done(function(data){
    console.log("weather found");
    rawData = data;
    getHourly();
  })
  .fail(function(error){
    console.log('error finding weather', error);
  });


}

function getHourly () {
  var url = apiUrl + 'hourly10day/q/'+ zipCode +'.json';

  $.get(url)
  .done(function(data){
    console.log("hourly found");
    rawHourly = data;
    getGeo();
  })
  .fail(function(error){
    console.log('error finding hourly', error);
  });

}

function getGeo() {
  var url = apiUrl + 'geolookup/q/'+ zipCode +'.json';

  $.get(url)
  .done(function(data){
    console.log("geo found");
    rawGeo = data;
    showWeather();
    showForecast();
  })
  .fail(function(error){
    console.log('error finding geography', error);
  });


}

function showWeather () {

  console.log('getting info', rawData, rawHourly)
  let time = rawData.forecast.txt_forecast.date.slice(0,-4);
  let loc = rawGeo.location.city + ', ' + rawGeo.location.state;
  let day = rawData.forecast.txt_forecast.forecastday[0].title;

  let hrly = rawHourly.hourly_forecast;
  let cTemp = hrly[0].temp.english;
  let cCond = hrly[0].condition;
  let cIcon = hrly[0].icon_url;

  let $cWeather = $('.currentWeather#sample').clone().removeAttr('id');
  $cWeather.find('.loc').text(loc + ' ' + zipCode);
  $cWeather.find('.time').text(day + ' ' + time);
  $cWeather.find('.icon img').attr('src', cIcon );
  $cWeather.find('.icon div').text(cCond);
  $cWeather.find('#temp').text(cTemp);
  $cWeather.find('#degreef').html('&#176;F');

  $('#nowContainer').empty();
  $('#nowContainer').append($cWeather);
  

}

function showForecast () {
  console.log('doot')
}

// rawData
// .forecast.txt_forecast.date  (current time)
// .forecast.simpleforecast.forecastday   ARRAY OF 4 DAYS
// .forecast.simpleforecast.forecastday[i].high.fahrenhiet
// .forecast.simpleforecast.forecastday[i].high.celsius
// .forecast.simpleforecast.forecastday[i].icon_url
// .forecast.simpleforecast.forecastday[i].low.fahrenhiet
// .forecast.simpleforecast.forecastday[i].low.celsius
// .forecast.simpleforecast.forecastday[i].qpf_day

// rawHourly
// .hourly_forecast[i].temp.english















