var twystContact = angular.module('twystRewardsWeek', ['toastr'])
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
})
.controller('RewardsWeekCtrl', function($scope, $http, $timeout, $window, toastSvc) {

    $scope.user = {};
    $scope.Cafes = [
        'Fruit Press, Cybercity',
        'Fruit Press, Sector 21',
        'Lean Chef',
        'Petooz',
        'Zaika Punjabi',
        'Potato Lovers Unltd',
        'Pitapan',
        'Pepbox',
        'Arabian Lites',
        'Quiznos',
        'Go Veg',
        'Sandwedges, Indirapuram',
        'Sandwedges, Raj Nagar'

    ];
    $scope.Pizzas = [
        'Coffee & Chai Co',
        'Café Wanderlust',
        'Madison & Pike',
        'Chai Adda',
        'Blackbuck" s Coffee',
        'The CUPnCAKE Factory',
        'Sucre Patisserie',
        'Binge',
        'Cherry Comet',
        'Movenpick'

    ];

    $scope.Pubs = [
        'Cocktail & Dreams, Speakeasy',
        'Vapour',
        'Striker Pub, Gurgaon',
        'Striker Pub, Delhi',
        'Brewer Street',
        '7 Degrees Brauhaus',
        'Blues',
        'Attitude',
        'Howzatt',
        'Fork You Too',
        'Caffe Madhouse',
        'Lighthouse 13',
        'The Liquor Warehouse',
        'Eat @ Joe" s',
        'Club Rhino',
        '7 Barrel Bew Pub'

    ];

    $scope.Rests = [
        'Tughlaq',
        'Joint Café',
        'Mistral',
        'The Breakfast Club',
        'Captain Grub',
        'Captain Bill$ Deliverz',
        'Leaping Caravan',
        'FrenZone',
        'Litti.in',
        'Twirteez',
        'Taxi',
        '1UP',
        'Touch Down',
        'Kebabnama',
        'The Spice Lab',
        'Krips',
        'Amigo"s Hub',
        'The Kathi" s',
        'Eat @ Joe" s',
        'Morsel to Mouth',
        'Bernardo" s',
        'Haandi TCT',
        'Purani Dilli" s Al Karam Kebab House'
    ];

    $scope.Biryanis = [
        'Biryani Blues, Supermart 1',
        'Biryani Blues, Sohna Rd',
        'Biryani Blues, Sector 23',
        'Biryani Paradise, Sector 31',
        'Biryani Paradise, Sector 23',
        'Andhra Biryani House',
        'Rumi"s Kitchen',
        'Canton Spice Co, Cyberhub',
        'Canton Spice Co, Punjabi Bagh',
        'Taste of China',
        'Kung Fu Chow',
        'China Chowk',
        'Yo! China, Sector 29'
    ]
    $scope.Italians = [
        'PizzaVito, South Pt Mall',
        'Crusty',
        'Italiano, Cyberhub',
        'Italiano, Nathupur',
        'Crust Bistro',
        'Chicago Pizza, HUDA Metropark',
        'Fat Lulu"s, Galleria',
        'Fat Lulu"s, Cross Pt Mall',
        'Fat Lulu"s, Saket',
        'New York Slice, Hauz Khas Village',
        'New York Slice, GK2',
        'New York Slice, Gurgaon',
        'New York Slice, Manesar',
        'La Pino"z Pizza, DLF Phase 1',
        'Flip Bistro, Galleria',
        'Flip Bistro, Gold Course Rd',
        'Pizza Square'
    ]


    

    $scope.selected_Cafes = [];
    $scope.selected_Pizzas = [];
    $scope.selected_Pubs = [];
    $scope.selected_Rests = [];
    $scope.selected_Biryanis = [];
    $scope.selected_Italians = [];
    $scope.selected_Rest = [];
    $scope.selected_Biryani = [];
    $scope.selected_Italian = [];
    $scope.selected_Cafe = [];
    $scope.selected_Pizza = [];
    $scope.selected_Pub = [];
    $scope.selected_outlet = [];
    

    $scope.togglePool = function (ischecked, pool, team) {
        if($scope.selected_Cafe[ischecked] || $scope.selected_Pizza[ischecked] || $scope.selected_Pub[ischecked]
                || $scope.selected_Rest[ischecked] || $scope.selected_Biryani[ischecked] || $scope.selected_Italian[ischecked]){
            console.log("checked")
            if($scope[pool].length === 2) {
                $scope.disable = true;
            }
            if($scope[pool].length < 3) {
                if ($scope[pool].indexOf(team) === -1) {
                    $scope.selected_outlet.push(team);
                    $scope[pool].push(team);
                } else {
                    $scope.disable = true;    
                    $scope[pool].splice($scope[pool].indexOf(team), 1);
                    
                }
            }  
            else {
                $scope.disable = true;
            }
        }
        
        else {
            $scope.disable = false;
            $scope.selected_outlet.splice($scope[pool].indexOf(team), 1);
            $scope[pool].splice($scope[pool].indexOf(team), 1);
        }
    }
    $scope.enableSelection = function () {
        $scope.disable = false;
        $scope.selected_Cafes = [];
        $scope.selected_Pizzas = [];
        $scope.selected_Pubs = [];
        $scope.selected_Rests = [];
        $scope.selected_Biryanis = [];
        $scope.selected_Italians = [];
        $scope.selected_Rest = [];
        $scope.selected_Biryani = [];
        $scope.selected_Italian = [];
        $scope.selected_Cafe = [];
        $scope.selected_Pizza = [];
        $scope.selected_Pub = [];
        $scope.selected_outlet = [];
    
        
    }

    $scope.enterContest = function () {
        if(isAllFilled()) {
            if(isMobileNumber($scope.user.phone)) {
                if(validateEmail($scope.user.email)) {
                    postData();
                }
                else {
                    toastSvc.showToast('error', 'Please provide a valid email id');
                }
            }
            else {
                toastSvc.showToast('error', 'Please provide a valid mobile number');
            }
        }
        else {
            toastSvc.showToast('error', 'Please fill all the fields and select 3 outlets.');
        }
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

    function isAllFilled() {
        var length = $scope.selected_Cafes.length + $scope.selected_Pizzas.length + $scope.selected_Pubs.length;
        if($scope.user.name
            && $scope.user.phone
            && $scope.user.email
            && $scope.user.dob
            && length === 3) {
            return true;
        }
        return false;
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

    function postData() { 
        $scope.user.name = $scope.user.name + ' (dob: ' + $scope.user.dob + ')';
        $scope.user.message = $scope.selected_Cafes.toString() + ',' + $scope.selected_Pizzas.toString() + ',' + $scope.selected_Pubs.toString();
        $http.post('/api/v1/beta/users', {
            name  : $scope.user.name,
            message         : $scope.user.message,
            phone        : $scope.user.phone,
            email               : $scope.user.email,
            contest: 'twyst_rewards_week'
        }).success(function (data, status, header, config) {
            redirect();
            toastSvc.showToast('success', 'Thank you for participating. We will contact the lucky winners after the results are declared,  after 10th March 2015.');
        })
        .error(function (data, status, header, config) {
            redirect();
            toastSvc.showToast('error', 'You have already participated in the contest. Results will be declared after 10th March 2015.');
        });
    };

    function redirect() {
        $timeout(function () {
            $window.location.href = '';
        }, 4000);
    }
});

