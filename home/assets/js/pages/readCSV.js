
var uploadUserDetails = angular.module('uploadUserDetails', ['toastr'])
.factory('toastSvc', function (toastr) {
    return {
        showToast: function (type, message, head) {
            toastr[type](message, 
            head, 
            {
                closeButton: true
            });
        }
    }
});


uploadUserDetails.controller('uploadCtrl', function ($scope, $http, $timeout, $window, toastSvc ) {
    $scope.fileChanged = function() {
      var reader = new FileReader();
      reader.onload = function(e) {
        $scope.$apply(function() {
          $scope.jsonData = csvTOJson(reader.result);
        });
      };

      var csvFileInput = document.getElementById('fileInput');    
      var csvFile = csvFileInput.files[0];
      reader.readAsText(csvFile);      
    }


    $scope.submitUserList = function(){
      var csvFileInput = document.getElementById('fileInput');  
      if(csvFileInput.files[0]) {
        $http.post('/api/v1/populate/card_user', {
          userData  : $scope.jsonData
          
        }).success(function (data, status, header, config) {
            redirect();
            toastSvc.showToast('success', 'Successfully updated');
        })
        .error(function (data, status, header, config) {
            redirect();
            toastSvc.showToast('error', 'There is some error in csv file.');
        });
    
      }
      else {
        alert("Plese Upload a CSV File");
        return false;
      }

      
    }
    
    function csvTOJson(csvFile){
 
      var allUsers = csvFile.split("\n");
      console.log(allUsers.length+ " allUsers");
     
      var result = [];
     
      var headers = allUsers[0].split(",");
     
      for(var i = 1; i < allUsers.length-1; i++){
     
        var obj = {};
        var currentUser = allUsers[i].split(",");
     
        for(var j = 0; j < headers.length; j++){
          if(currentUser[j] != undefined){
            obj[headers[j].trim()] = currentUser[j].trim();  
          }          

          if(j == 1 && currentUser[j] != undefined) {
            if(!validateEmail(currentUser[j].trim())) {
              alert('wrong email in sheet ' + currentUser[j] + " " + j);
              return false;
            }
          }

          else if(j == 2 && currentUser[j] != undefined) {
            if(!isMobileNumber(currentUser[j].trim())) {
              alert('wrong mobileNumber in sheet ' + currentUser[j] + " " + j);
              return false;
            }      
          }
        }
        console.log(obj);
        result.push(obj);
      }            
      return result; 
    }

    function isMobileNumber(phone) {
        if(phone 
            && (phone.length === 10)
            && isNumber(phone) 
            && isValidFirstDigit(phone)) {
            return true;
        };
        return false;
    }

    function isValidFirstDigit(phone) {
        if(phone[0] === '7'
            || phone[0] === '8'
            || phone[0] === '9') {
            return true;
        }
        return false;
    }

    function isNumber(str) {
        var numeric = /^-?[0-9]+$/;
        return numeric.test(str);
    }

    

    function isValidPhone () {
        if(!$scope.user.phone
            || isNaN($scope.user.phone)
            || $scope.user.phone.length !== 10) {
            
            return false;
        }
        return true;
    }

    function validateEmail(email) { 
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    function redirect() {
        $timeout(function () {
            $window.location.href = 'http://localhost:3000/home/upload_card_user.html';
        }, 4000);
    }    
});

    
