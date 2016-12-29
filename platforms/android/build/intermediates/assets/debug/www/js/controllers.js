angular.module('starter.controllers', [])

.controller('DashboardCtrl', function($scope) {

  var employee_name = window.localStorage.getItem("employee_name");
  $scope.employee_name = employee_name;

})

.controller('MapCtrl', function($scope, $ionicPlatform, $state, $cordovaGeolocation, radius) {
  var options = {timeout: 10000, enableHighAccuracy: true};
 
  $ionicPlatform.ready(function() {
    $cordovaGeolocation.getCurrentPosition(options).then(function(position){
    
        var goslat = -6.260733;
        var goslong = 106.829447;

        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        var gos = new google.maps.LatLng(goslat, goslong);
        

        var mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
        };
    
        $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

        var myloc = new google.maps.Marker({
            clickable: false,
            icon: "img/people2.png",
            shadow: null,
            zIndex: 999,
            map: $scope.map
        });
    //Wait until the map is loaded
        google.maps.event.addListenerOnce($scope.map, 'idle', function(){
        
            myloc.setPosition(latLng);

            var marker2 = new google.maps.Circle({
                strokeColor: '#5e95ce',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#b7e3cc',
                fillOpacity: 0.4,
                center: {lat : goslat, lng : goslong},
                radius: 200,
                map: $scope.map,
            });      

            dist = google.maps.geometry.spherical.computeDistanceBetween(latLng, gos);
            
            console.log(dist.toFixed(1)+' meters');      
        });

    }, function(error){
        console.log("Could not get location "+error);
    });
  });
})

.controller('ComplainHandlingCtrl', function($scope) {})


.controller('CalendarSiteVisitCtrl', function($scope, schedule, lokasi, $ionicLoading, $ionicModal, $ionicPlatform, $state, $cordovaGeolocation, radius, $ionicScrollDelegate) {

        'use strict';
        $scope.calendar = {};
        $scope.changeMode = function (mode) {
            $scope.calendar.mode = mode;
        };

        var sc = new schedule();
        var send = [];

        $scope.scrollToTop = function(){
            $ionicScrollDelegate.$getByHandle('modalScroll').scrollTop();
        };

        angular.forEach(window.localStorage, function(k,v){
            send[v] = k;
        });

        send["get"] = "all";


        function getMap(lat, long)
        {
            var options = {timeout: 10000, enableHighAccuracy: true};
            $ionicPlatform.ready(function() {
                $cordovaGeolocation.getCurrentPosition(options).then(function(position){
                    
                    var goslat = parseFloat(lat);
                    var goslong = parseFloat(long);

                    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    var gos = new google.maps.LatLng(goslat, goslong);
                    

                    var mapOptions = {
                    center: latLng,
                    zoom: 15,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    draggable: false,
                    scrollwheel: true
                    };
                
                    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

                    var myloc = new google.maps.Marker({
                        clickable: false,
                        icon: "img/people2.png",
                        shadow: null,
                        zIndex: 999,
                        map: $scope.map
                    });
                //Wait until the map is loaded
                    google.maps.event.addListenerOnce($scope.map, 'idle', function(){
                    
                        myloc.setPosition(latLng);

                        var marker2 = new google.maps.Circle({
                            strokeColor: '#5e95ce',
                            strokeOpacity: 0.8,
                            strokeWeight: 2,
                            fillColor: '#b7e3cc',
                            fillOpacity: 0.4,
                            center: {lat : goslat, lng : goslong},
                            radius: 200,
                            map: $scope.map,
                        });      

                        var bounds = new google.maps.LatLngBounds();                            
                        bounds.extend(latLng);
                        bounds.extend(gos);
                        $scope.map.fitBounds(bounds);

                        var dist = google.maps.geometry.spherical.computeDistanceBetween(latLng, gos);                        
                    });

                }, function(error){
                    console.log("Could not get location "+error);
                });
            });
        }

        var markersetmap;

        function getSetMap()
        {
            var options = {timeout: 10000, enableHighAccuracy: true};
            
            $ionicPlatform.ready(function() {
                $cordovaGeolocation.getCurrentPosition(options).then(function(position){
                

                    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    

                    var mapOptions = {
                    center: latLng,
                    zoom: 15,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                    };
                
                    $scope.setmap = new google.maps.Map(document.getElementById("setmap"), mapOptions);

                    var myloc = new google.maps.Marker({
                        clickable: false,
                        icon: "img/people2.png",
                        shadow: null,
                        zIndex: 999,
                        map: $scope.setmap
                    });
                //Wait until the map is loaded
                    google.maps.event.addListenerOnce($scope.setmap, 'idle', function(){
                    
                        myloc.setPosition(latLng);

                    });

                }, function(error){
                    console.log("Could not get location "+error);
                });
            });
        }



        $scope.doGet = function(){
            send["per_page"] = 0;
            $ionicLoading.show();
            var svv = sc.$get(send, function(resp){
                return resp.schedules;
            });

            var events = [];
            svv.then(function(r){
                angular.forEach(r.schedules, function(k,v){
                    var now = new Date(k.visit_datetime_start);
                    var utc = now.toISOString();
                    //var utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());

                    var ends = now.setHours(now.getHours()+1);
                    var ends = new Date(ends);
                    var utcends = ends.toISOString();

//                    var utcends = new Date(ends.getUTCFullYear(), ends.getUTCMonth(), ends.getUTCDate(),  ends.getUTCHours(), ends.getUTCMinutes(), ends.getUTCSeconds());
                    events.push({
                        title : k.doc_seq_sc + ' - ' + k.location_site_visit_name+ ' - ' + k.destination,
                        schedule_id : k.schedule_id,
                        doc_seq_sc : k.doc_seq_sc,
                        pm_name : k.pm_name,
                        seso_name : k.seso_name,
                        status_app_name : k.status_app_name,
                        class_status : k.class_status,
                        location_site_visit_name : k.location_site_visit_name,
                        location_site_visit_id : k.location_site_visit_id,
                        lat : k.lat,
                        long : k.long,
                        place_description : k.place_description,
                        destination : k.destination,
                        startTime : utc,
                        endTime : utcends,
                        allDay : false
                    });

                    //console.log(utc+ ' ' + utcends);
                });
                $ionicLoading.hide();
            }); 
            $scope.calendar.eventSource = events;     
        };

        $scope.doGet();


        $ionicModal.fromTemplateUrl('templates/scheduledetails.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });

 
        $scope.modalHide = function() {
           $scope.modal.hide();
        };

        // Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });
 
        // Execute action on hide modal
        $scope.$on('modal.hidden', function() {
        // Execute action
        });

        // Execute action on remove modal
        $scope.$on('modal.removed', function() {
        // Execute action
        });


        $ionicModal.fromTemplateUrl('templates/setmap.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modalMap = modal;
        });

        $scope.locationChange = function(location)
        {
            $scope.getLatLng(location.place_id);
        };

        $scope.lokasi = {};
        $scope.lokasi = new lokasi();
 

        $scope.getLatLng = function(placeId){
            var geocoder = new google.maps.Geocoder;

                geocoder.geocode({'placeId': placeId}, function(results, status) {
                if(status === 'OK'){
                if(results[0]){
                        //Wait until the map is loaded
                                if(!markersetmap)
                                {
                                    markersetmap = new google.maps.Marker({
                                        clickable: false,
                                        shadow: null,
                                        zIndex: 999,
                                        position : results[0].geometry.location,
                                        map: $scope.setmap
                                    });
                                }
                                else
                                {
                                    markersetmap.setPosition(results[0].geometry.location);
                                }
                                markersetmap.setMap($scope.setmap);
                                $scope.setmap.setCenter(results[0].geometry.location);
                                $scope.lokasi.lat = results[0].geometry.location.lat();
                                $scope.lokasi.long = results[0].geometry.location.lng();
                                $scope.lokasi.place_id = placeId;
                                $scope.lokasi.place_description = results[0].formatted_address;
                        }
                        else {
                            console.log("no results");
                        }
                    }
                    else {
                        console.log("error");
                    }
                });
        };

        $scope.submitSetMap = function(){
            console.log($scope.lokasi);
            $scope.lokasi.$save(function(resp){
                if(resp.success)
                {
                    alert("Ubah Lokasi Berhasil");
                    $scope.modalMapHide();
                }
                else
                {
                    alert("Ubah Lokasi Gagal");                    
                }
            });
        };


        $scope.modalMapHide = function() {
           $scope.modalMap.hide();
        };

        // Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.modalMap.remove();
        });
 
        // Execute action on hide modal
        $scope.$on('modal.hidden', function() {
        // Execute action
        });

        // Execute action on remove modal
        $scope.$on('modal.removed', function() {
        // Execute action
        });



        $scope.onEventSelected = function (event) {
            $scope.schedule_id = event.schedule_id;
            $scope.lokasi.location_site_visit_id = event.location_site_visit_id;
            $scope.location_site_visit_name = event.location_site_visit_name;
            $scope.place_description = event.place_description;
            $scope.doc_seq_sc = event.doc_seq_sc;
            $scope.pm_name = event.pm_name;
            $scope.seso_name = event.seso_name;
            $scope.destination = event.destination;

            $scope.modal.show();
            $scope.scrollToTop();
            getMap(event.lat, event.long);
        };


        $scope.setMap = function (event) {
            $scope.modalMap.show();
            getSetMap();
        };

        $scope.onViewTitleChanged = function (title) {
            $scope.viewTitle = title;
        };

        $scope.today = function () {
            $scope.calendar.currentDate = new Date();
        };

        $scope.isToday = function () {
            var today = new Date(),
                currentCalendarDate = new Date($scope.calendar.currentDate);

            today.setHours(0, 0, 0, 0);
            currentCalendarDate.setHours(0, 0, 0, 0);
            return today.getTime() === currentCalendarDate.getTime();
        };

        $scope.onTimeSelected = function (selectedTime, events, disabled) {
            console.log('Selected time: ' + selectedTime + ', hasEvents: ' + (events !== undefined && events.length !== 0) + ', disabled: ' + disabled);
        };
})

.controller('FormSiteVisitCtrl', function($ionicPlatform, $cordovaCamera, $cordovaFileTransfer, $log, $scope, $ionicPopup, $state, site_visit, schedule, $http, $ionicSlideBoxDelegate, ionicDatePicker, ionicTimePicker, MonthPicker) {

    var fileData;
    var fileName;
    $ionicPlatform.ready(function() {
      $scope.openPhotoLibrary = function() {
              var options = {
                  quality: 50,
                  destinationType: Camera.DestinationType.FILE_URI,
                  sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                  allowEdit: false,
                  encodingType: Camera.EncodingType.JPEG,
                  popoverOptions: CameraPopoverOptions,
                  saveToPhotoAlbum: false
              };

              $cordovaCamera.getPicture(options).then(function(imageData) {

                  //console.log(imageData);
                  //console.log(options);   
                  $scope.fileData = imageData; 
                  $scope.fileName = imageData; 


                  var server = "http://yourdomain.com/upload.php",
                      filePath = imageData;

                  var date = new Date();

                  var options = {
                      fileKey: "file",
                      fileName: imageData.substr(imageData.lastIndexOf('/') + 1),
                      chunkedMode: false,
                      mimeType: "image/jpg"
                  };


              }, function(err) {
                  // error
                  console.log(err);
              });
          };

      $scope.takePhoto = function() {
              var options = {
                  quality: 50,
                  destinationType: Camera.DestinationType.FILE_URI,
                  sourceType: Camera.PictureSourceType.CAMERA,
                  allowEdit: false,
                  encodingType: Camera.EncodingType.JPEG,
                  popoverOptions: CameraPopoverOptions,
                  saveToPhotoAlbum: false
              };

              $cordovaCamera.getPicture(options).then(function(imageData) {

                  //console.log(imageData);
                  //console.log(options);   
                  $scope.fileData = imageData; 
                  $scope.fileName = imageData; 

                  var server = "http://yourdomain.com/upload.php",
                      filePath = imageData;

                  var date = new Date();

              }, function(err) {
                  // error
                  console.log(err);
              });
          };



    });




      //Reset headers to avoid OPTIONS request (aka preflight)
    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
      viewData.enableBack = true;
      if($scope.slideIndex!==0)
        $scope.slideTo=0;
    }); 

    $scope.sitevisit = {};
    var monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];

 
    $scope.sitevisit = new site_visit();
    $scope.schedule = new schedule();
    $scope.client_id = 0;

    $scope.schedules = [{
        visit_datetime_start_caption: "",
        visit_datetime_start: "",
        visit_datetime_end : "",
        visit_datetime_end_caption : ""
    }];

    $scope.addInput = function () {
        $scope.schedules.push({
            b : {
                  visit_datetime_start_caption: "",
                  visit_datetime_start: "",
                  visit_datetime_end : "",
                  visit_datetime_end_caption : ""
            }
        });
    };

    $scope.removeInput = function (index) {
        $scope.schedules.splice(index, 1);
    };

    $scope.goBack = function() {
        $state.go('app.sitevisit');
        //$state.go('app.tab.listsitevisit');
    };


    $scope.doSave = function() {
        $scope.sitevisit.employee_id = window.localStorage.getItem("employee_id");
        $scope.sitevisit.user_id = window.localStorage.getItem("user_id");
        $scope.sitevisit.role_id = window.localStorage.getItem("role_id");
        $scope.sitevisit.$save(function(resp){
                if(!resp.success)
                {
                    alert(resp.message);
                }
        });
        $scope.client_id = $scope.sitevisit.client_id;
    };

    $scope.doSaveSchedule = function() {
        $scope.schedule.employee_id = window.localStorage.getItem("employee_id");
        $scope.schedule.user_id = window.localStorage.getItem("user_id");
        $scope.schedule.role_id = window.localStorage.getItem("role_id");
        $scope.schedule.visit_date = $scope.schedules;
        $scope.schedule.$save();
        //$state.go('app.tab.listsitevisit');
    };

    $scope.getSBU = function(){
        var xhr = $http({
            method : "GET",
            url : "http://eportal.gos.co.id/eportal_dev/index.php/api/site_visit/getSBU"
        });
        xhr.success(function(data){
            $scope.dataSBU =  data.data;
        });
    };


    $scope.getCategory = function(){
        var xhr = $http({
            method : "GET",
            url : "http://eportal.gos.co.id/eportal_dev/index.php/api/site_visit/getCategory"
        });
        xhr.success(function(data){
            $scope.data =  data.data;
        });
    };

    $scope.getClient = function(query,isInitializing){
        if(isInitializing)
        {
            return {};
        }
        else
        {
            if(query) return $http.get("http://eportal.gos.co.id/eportal_dev/index.php/api/site_visit/load_client/"+query);
        }
    };


    $scope.getESO = function(query,isInitializing){
        if(isInitializing)
        {
            return {};
        }
        else
        {
            if(query) return $http.get("http://eportal.gos.co.id/eportal_dev/index.php/api/site_visit/getESO/"+query);
        }
    };


    $scope.getLocation = function(query,isInitializing){
        console.log($scope.client_id);
        if(isInitializing)
        {
            return {};
        }
        else
        {
            if(query) 
              return $http.get("http://eportal.gos.co.id/eportal_dev/index.php/api/site_visit/getLocation/"+query+"/"+$scope.client_id);
        }
    };


    $scope.clickedMethod = function(callback){
//        console.log(callback);  
    };

    $scope.clickedESO = function(callback){
//        console.log(callback);  
    };


    $scope.disableSwipe = function(){
      console.log(this);
      $ionicSlideBoxDelegate.slide(0);
      $ionicSlideBoxDelegate.enableSlide(false);
    };

    $scope.next = function(){
        $ionicSlideBoxDelegate.next();
        $ionicSlideBoxDelegate.enableSlide(false);
    };

    $scope.previous = function(){
        $ionicSlideBoxDelegate.previous();
    };

    $scope.slideHasChanged = function(index){
        $scope.slideIndex = index;
    };


    // configure time picker
    var ipObjTime = {
    callback: function (val) {      //Mandatory
      if (typeof (val) === 'undefined') {
        console.log('Time not selected');
      } else {
//        console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), 'H :', selectedTime.getUTCMinutes(), 'M');
        var selectedTime = new Date(val * 1000);
        var hr = (selectedTime.getUTCHours()<=9) ? "0"+selectedTime.getUTCHours() : selectedTime.getUTCHours();
        var mm = (selectedTime.getUTCMinutes()<=9) ? "0"+selectedTime.getUTCMinutes() : selectedTime.getUTCMinutes();
        
        $scope.schedule.visit_datetime_start = $scope.schedule.visit_datetime_start+" "+hr+":"+mm+":"+"00";
        $scope.schedule.visit_datetime_start_caption = $scope.schedule.visit_datetime_start_caption+" "+hr+":"+mm+":"+"00";
      }
    },
    inputTime: 50400,   //Optional
    format: 24,         //Optional
    step: 15,           //Optional
    setLabel: 'Set2'    //Optional
  };


    var ipObjTimeEnd = {
    callback: function (val) {      //Mandatory
      if (typeof (val) === 'undefined') {
        console.log('Time not selected');
      } else {
//        console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), 'H :', selectedTime.getUTCMinutes(), 'M');
        var selectedTime = new Date(val * 1000);
        var hr = (selectedTime.getUTCHours()<=9) ? "0"+selectedTime.getUTCHours() : selectedTime.getUTCHours();
        var mm = (selectedTime.getUTCMinutes()<=9) ? "0"+selectedTime.getUTCMinutes() : selectedTime.getUTCMinutes();
        
        $scope.schedule.visit_datetime_end = $scope.schedule.visit_datetime_end+" "+hr+":"+mm+":"+"00";
        $scope.schedule.visit_datetime_end_caption = $scope.schedule.visit_datetime_end_caption+" "+hr+":"+mm+":"+"00";
      }
    },
    inputTime: 50400,   //Optional
    format: 24,         //Optional
    step: 15,           //Optional
    setLabel: 'Set2'    //Optional
  };


    // configure datepicker
    var ipObj1 = {
      callback: function (val) {  //Mandatory
        ionicTimePicker.openTimePicker(ipObjTime);
        var dt = new Date(val);
        var day = (dt.getDate()<=9) ? "0"+dt.getDate() : dt.getDate();
        var monthIndex = dt.getMonth();
        var year = dt.getFullYear();
         var mth = (dt.getMonth()+1<=9) ? "0"+(dt.getMonth()+1) : dt.getMonth()+1;
        $scope.schedule.visit_datetime_start_caption = day+" "+ monthNames[monthIndex]+" "+year;
        $scope.schedule.visit_datetime_start = year+"-"+mth+"-"+day;
      },
      disabledDates: [            //Optional
        new Date(2016, 2, 16),
        new Date(2015, 3, 16),
        new Date(2015, 4, 16),
        new Date(2015, 5, 16),
        new Date('Wednesday, August 12, 2015'),
        new Date("08-16-2016"),
        new Date(1439676000000)
      ],
      from: new Date(2012, 1, 1), //Optional
      to: new Date(2016, 10, 30), //Optional
      inputDate: new Date(),      //Optional
      mondayFirst: true,          //Optional
      disableWeekdays: [0],       //Optional
      closeOnSelect: false,       //Optional
      templateType: 'popup',       //Optional
      dateFormat : 'dd MMMM yyyy'
    };

    $scope.openDatePicker = function(index){
      ionicDatePicker.openDatePicker({
      callback: function (val) {  //Mandatory
          ionicTimePicker.openTimePicker({
          callback: function (val) {      //Mandatory
            if (typeof (val) === 'undefined') {
              console.log('Time not selected');
            } else {
      //        console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), 'H :', selectedTime.getUTCMinutes(), 'M');
              var selectedTime = new Date(val * 1000);
              var hr = (selectedTime.getUTCHours()<=9) ? "0"+selectedTime.getUTCHours() : selectedTime.getUTCHours();
              var mm = (selectedTime.getUTCMinutes()<=9) ? "0"+selectedTime.getUTCMinutes() : selectedTime.getUTCMinutes();
              
              $scope.schedules[index].visit_datetime_start = $scope.schedules[index].visit_datetime_start+" "+hr+":"+mm+":"+"00";
              $scope.schedules[index].visit_datetime_start_caption = $scope.schedules[index].visit_datetime_start_caption+" "+hr+":"+mm+":"+"00";
            }
          },
          inputTime: 50400,   //Optional
          format: 24,         //Optional
          step: 15,           //Optional
          setLabel: 'Set2'    //Optional
        });
        var dt = new Date(val);
        var day = (dt.getDate()<=9) ? "0"+dt.getDate() : dt.getDate();
        var monthIndex = dt.getMonth();
        var year = dt.getFullYear();
         var mth = (dt.getMonth()+1<=9) ? "0"+(dt.getMonth()+1) : dt.getMonth()+1;
        $scope.schedules[index].visit_datetime_start_caption = day+" "+ monthNames[monthIndex]+" "+year;
        $scope.schedules[index].visit_datetime_start = year+"-"+mth+"-"+day;
      },
      from: new Date(2012, 1, 1), //Optional
      inputDate: new Date(),      //Optional
      mondayFirst: true,          //Optional
      disableWeekdays: [0],       //Optional
      closeOnSelect: false,       //Optional
      templateType: 'popup',       //Optional
      dateFormat : 'dd MMMM yyyy'
    });
    };

    $scope.openDateVisitPeriod = function(){
      MonthPicker.init({maxMonthIndex : 12, startingYear : new Date().getFullYear(), maxYear : new Date().getFullYear()+1});
      MonthPicker.show(function(res){
        console.log(res);
        $scope.sitevisit.visit_period_caption = monthNames[res.month]+" "+res.year;
        $scope.sitevisit.visit_period = res.year+"-"+((res.month<10) ? "0"+res.month : res.month);        
      });
      //ionicDatePicker.openDatePicker(ipObjVisitPeriod);
    };


    var ipObjEnd = {
      callback: function (val) {  //Mandatory
        ionicTimePicker.openTimePicker(ipObjTimeEnd);
        var dt = new Date(val);
        var day = (dt.getDate()<=9) ? "0"+dt.getDate() : dt.getDate();
        var monthIndex = dt.getMonth();
        var year = dt.getFullYear();
         var mth = (dt.getMonth()+1<=9) ? "0"+(dt.getMonth()+1) : dt.getMonth()+1;
        $scope.sitevisit.visit_datetime_end_caption = day+" "+ monthNames[monthIndex]+" "+year;
        $scope.sitevisit.visit_datetime_end = year+"-"+mth+"-"+day;
      },
      from: new Date(2012, 1, 1), //Optional
      inputDate: new Date(),      //Optional
      mondayFirst: true,          //Optional
      disableWeekdays: [0],       //Optional
      closeOnSelect: false,       //Optional
      templateType: 'popup',       //Optional
      dateFormat : 'dd MMMM yyyy'
    };


    $scope.openDatePickerEnd = function(index){
      ionicDatePicker.openDatePicker({
      callback: function (val) {  //Mandatory
          ionicTimePicker.openTimePicker({
          callback: function (val) {      //Mandatory
            if (typeof (val) === 'undefined') {
              console.log('Time not selected');
            } else {
      //        console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), 'H :', selectedTime.getUTCMinutes(), 'M');
              var selectedTime = new Date(val * 1000);
              var hr = (selectedTime.getUTCHours()<=9) ? "0"+selectedTime.getUTCHours() : selectedTime.getUTCHours();
              var mm = (selectedTime.getUTCMinutes()<=9) ? "0"+selectedTime.getUTCMinutes() : selectedTime.getUTCMinutes();
              
              $scope.schedules[index].visit_datetime_end = $scope.schedules[index].visit_datetime_end+" "+hr+":"+mm+":"+"00";
              $scope.schedules[index].visit_datetime_end_caption = $scope.schedules[index].visit_datetime_end_caption+" "+hr+":"+mm+":"+"00";
            }
          },
          inputTime: 50400,   //Optional
          format: 24,         //Optional
          step: 15,           //Optional
          setLabel: 'Set2'    //Optional
        });
        var dt = new Date(val);
        var day = (dt.getDate()<=9) ? "0"+dt.getDate() : dt.getDate();
        var monthIndex = dt.getMonth();
        var year = dt.getFullYear();
         var mth = (dt.getMonth()+1<=9) ? "0"+(dt.getMonth()+1) : dt.getMonth()+1;
        $scope.schedules[index].visit_datetime_end_caption = day+" "+ monthNames[monthIndex]+" "+year;
        $scope.schedules[index].visit_datetime_end = year+"-"+mth+"-"+day;
      },
      from: new Date(2012, 1, 1), //Optional
      inputDate: new Date(),      //Optional
      mondayFirst: true,          //Optional
      disableWeekdays: [0],       //Optional
      closeOnSelect: false,       //Optional
      templateType: 'popup',       //Optional
      dateFormat : 'dd MMMM yyyy'
    });
    };

})

.controller('SiteVisitCtrl', function($ionicLoading, $scope, site_visit, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
    // Set Header

    var totalSiteVisit = 10;
    $scope.moredata = true;
    // Delay expansion
    $timeout(function() {
        $scope.isExpanded = true;
    }, 300);


    // Set Ink
    ionicMaterialInk.displayEffect();
    var send = [];
    angular.forEach(window.localStorage, function(k,v){
          send[v] = k;
    });

    var sv = new site_visit();



    send["get"] = "all";
    $scope.doRefresh = function(){
      send["per_page"] = 0;
      var sv = new site_visit();
      var svv = sv.$get(send, function(resp){
          return resp.site_visits;
      });

      svv.then(function(r){
        $scope.svs = r.site_visits;
        $scope.$broadcast('scroll.refreshComplete');
      });      
    };


    $scope.doGet = function(){
      send["per_page"] = 0;
      $ionicLoading.show();
      var svv = sv.$get(send, function(resp){
          return resp.site_visits;
      });

      svv.then(function(r){
        $scope.svs = r.site_visits;
        $ionicLoading.hide();
      });      
    };

    $scope.doGet();
    console.log($scope.moredata);
    $scope.getMoreData = function() {
      send["per_page"] = 20;
      var svv = sv.$get(send, function(resp){
          return resp.site_visits;
      });

      svv.then(function(r){
        if(r.site_visits.length>0)
        {
          $scope.moredata = true;
          $scope.svs.push(r.site_visits);
        }
        else
        {
          $scope.moredata = false;
        }
        console.log($scope.moredata);
        $ionicLoading.hide();
      });      
      $scope.$broadcast('scroll.infiniteScrollComplete');      
    };

    $scope.$on('$stateChangeSuccess', function() {
//        console.log("changesuccess");
//       $scope.getMoreData();
    });

    $scope.addListSiteVisit = function(done){
      if($scope.svs.length>$scope.totalSiteVisit)
        $scope.totalSiteVisit += 10; 
      done();     
    };

})


.controller('ListSiteVisitCtrl', function($scope, site_visit, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.$parent.setHeaderFab('left');

    // Delay expansion
    $timeout(function() {
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
    }, 300);

    // Set Motion
    ionicMaterialMotion.fadeSlideInRight();

    // Set Ink
    ionicMaterialInk.displayEffect();

    var svs = new site_visit();
    $scope.svs = svs.get();
})


.controller('AppCtrl', function($scope, Auth, $state) {
  var employee_name = window.localStorage.getItem("employee_name");
  $scope.employee_name = employee_name;
  $scope.doLogout = function(){
    Auth.logout();
    $state.go('login');
  };
})

.controller('LoginCtrl', function($ionicHistory, $scope, user, $state, $ionicPopup, Auth) {
    
    $scope.login = {};

    $scope.login = new user();

    $scope.doLogin = function() {
        //console.log($scope.sitevisit);
        $scope.login.$get({username:$scope.login.username,password:$scope.login.password},function(response){
          console.log(response);
          if(response.success=='true')
          {
            Auth.login(response.session);
            $ionicHistory.clearCache().then(function(){ $state.go('app.dashboard') });
          }
          else
          {
            alert("Login Gagal");
          }
        });
    };

})

.directive('validNumber', function() {
  return {
    require: '?ngModel',
    link: function(scope, element, attrs, ngModelCtrl) {
      if(!ngModelCtrl) {
        return; 
      }

      ngModelCtrl.$parsers.push(function(val) {
        if (angular.isUndefined(val)) {
            var val = '';
        }
        var clean = val.replace( /[^0-9]+/g, '');
        if (val !== clean) {
          ngModelCtrl.$setViewValue(clean);
          ngModelCtrl.$render();
        }
        return clean;
      });

      element.bind('keypress', function(event) {
        if(event.keyCode === 32) {
          event.preventDefault();
        }
      });
    }
  };
});
;