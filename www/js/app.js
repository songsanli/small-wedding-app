angular.module('weddingApp', ['ionic'])

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('home', {
            url: "/home",
            templateUrl: "templates/home.html",
            controller: 'homeController'
        })
        .state('lection', {
            url: "/lection",
            templateUrl: "templates/lection.html"
        })
        .state('timelocation', {
            url: "/timelocation",
            templateUrl: "templates/timelocation.html"
        })
        .state('thanks', {
            url: "/thanks",
            templateUrl: "templates/thanks.html"
        })
        .state('photos', {
            url: "/photos",
            templateUrl: "templates/photos.html",
            controller: 'photoController'
        });

    $urlRouterProvider.otherwise("/home");
})
.controller('homeController', ['$scope', '$ionicLoading', function($scope, $ionicLoading) {
    $scope.imagesLoaded = false;

    $ionicLoading.show({
        content: 'Loading Data',
        animation: 'fade-in',
        showBackdrop: false,
        maxWidth: 200,
        showDelay: 500
    });

    imagesLoaded(document.querySelector('body'), function(instance) {
        console.log('all images are loaded');
        $scope.imagesLoaded = true;
        $ionicLoading.hide();
    });
}])

.controller('photoController', ['$scope', '$ionicModal', function($scope, $ionicModal) {
    $scope.photos = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27'];
    $scope.onImgClick = function(index) {
        $scope.currentIndex = index;
        $ionicModal.fromTemplateUrl('templates/photo.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
            $scope.modal.show();
        });
    }
    $scope.closeModal = function() {
        $scope.modal.hide();
    };
    $scope.$on('$destroy', function() {
        $scope.modal && $scope.modal.remove();
    });

}])

.directive('ionLazyImg', ['$http', '$timeout', '$compile', function($http, $timeout, $compile) {
    return {
        restrict:'E',
        replace:true,
        scope: {
            imgUrl: '@',
            imgClick: '&'
        },
        template: '<ion-spinner icon="ios"></ion-spinner>',
        link: function($scope, $element, $attrs) {
            $element.addClass('ion-lazy-img');
            var eClass=$attrs['class'];
            // $element.find('svg').addClass(eClass);
            var imgEl = $compile('<img src="{{imgUrl}}" class="ion-lazy-img"></img>')($scope);
            imgEl.addClass(eClass);
            imgEl.bind('click',function(e){
                $scope.imgClick();
            });
            imgEl.bind('load',function(e){
                $timeout(function(){
                    $element.replaceWith(imgEl);
                },0);
            });
        }
    }
}]);
