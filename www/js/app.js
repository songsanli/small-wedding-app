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
    $scope.photos = [
        {index: '1', dataSize: '1997x1407'},
        {index: '2', dataSize: '1877x1182'},
        {index: '3', dataSize: '2496x1408'},
        {index: '4', dataSize: '2372x1404'},
        {index: '5', dataSize: '2448x3264'},
        {index: '6', dataSize: '2448x2447'},
        {index: '7', dataSize: '1732x2309'},
        {index: '8', dataSize: '3328x2285'},
        {index: '9', dataSize: '3452x2318'},
        {index: '10', dataSize: '3465x2310'},
        {index: '11', dataSize: '3465x2310'},
        {index: '12', dataSize: '3465x2310'},
        {index: '13', dataSize: '3466x2309'},
        {index: '14', dataSize: '3009x2079'},
        {index: '15', dataSize: '3465x2310'},
        {index: '16', dataSize: '6144x4096'},
        {index: '17', dataSize: '2310x3465'},
        {index: '18', dataSize: '4096x6144'},
        {index: '19', dataSize: '2310x3465'},
        {index: '20', dataSize: '4096x6144'},
        {index: '21', dataSize: '2136x2136'},
        {index: '22', dataSize: '4096x6144'},
        {index: '23', dataSize: '2203x3303'},
        {index: '24', dataSize: '4096x6144'},
        {index: '25', dataSize: '2310x3465'},
        {index: '26', dataSize: '2310x3465'},
        {index: '27', dataSize: '750x750'},
        {index: '28', dataSize: '5166x3469'}
    ];
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

    // find nearest parent element
    var closest = function closest(el, fn) {
        return el && ( fn(el) ? el : closest(el.parentNode, fn) );
    };

    // parse picture index and gallery index from URL (#&pid=1&gid=2)
    var photoswipeParseHash = function() {
        var hash = window.location.hash.substring(1),
        params = {};

        if(hash.length < 5) {
            return params;
        }

        var vars = hash.split('&');
        for (var i = 0; i < vars.length; i++) {
            if(!vars[i]) {
                continue;
            }
            var pair = vars[i].split('=');  
            if(pair.length < 2) {
                continue;
            }           
            params[pair[0]] = pair[1];
        }

        if(params.gid) {
            params.gid = parseInt(params.gid, 10);
        }

        return params;
    };

    // parse slide data (url, title, size ...) from DOM elements 
    // (children of gallerySelector)
    var parseThumbnailElements = function(el) {
        var thumbElements = el.childNodes,
            numNodes = thumbElements.length,
            items = [],
            figureEl,
            linkEl,
            size,
            item;

        for(var i = 0; i < numNodes; i++) {

            figureEl = thumbElements[i]; // <figure> element

            // include only element nodes 
            if(figureEl.nodeType !== 1) {
                continue;
            }

            linkEl = figureEl.children[0]; // <a> element

            size = linkEl.getAttribute('data-size').split('x');

            // create slide object
            item = {
                src: linkEl.getAttribute('href'),
                w: parseInt(size[0], 10),
                h: parseInt(size[1], 10)
            };



            if(figureEl.children.length > 1) {
                // <figcaption> content
                item.title = figureEl.children[1].innerHTML; 
            }

            if(linkEl.children.length > 0) {
                // <img> thumbnail element, retrieving thumbnail url
                item.msrc = linkEl.children[0].getAttribute('src');
            } 

            item.el = figureEl; // save link to element for getThumbBoundsFn
            items.push(item);
        }

        return items;
    };

    var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
        var pswpElement = document.querySelectorAll('.pswp')[0],
            gallery,
            options,
            items;

        items = parseThumbnailElements(galleryElement);

        // define options (if needed)
        options = {

            showHideOpacity: true,
            // define gallery index (for URL)
            galleryUID: galleryElement.getAttribute('data-pswp-uid'),

            getThumbBoundsFn: function (index) {
                // See Options -> getThumbBoundsFn section of documentation for more info
                var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
                    pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                    rect = thumbnail.getBoundingClientRect(); 

                return {
                    x: rect.left,
                    y: rect.top + pageYScroll,
                    w: rect.width,
                    opacity: 0
                };
            }

        };

        // PhotoSwipe opened from URL
        if(fromURL) {
            if(options.galleryPIDs) {
                // parse real index when custom PIDs are used 
                // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
                for(var j = 0; j < items.length; j++) {
                    if(items[j].pid == index) {
                        options.index = j;
                        break;
                    }
                }
            } else {
                // in URL indexes start from 1
                options.index = parseInt(index, 10) - 1;
            }
        } else {
            options.index = parseInt(index, 10);
        }

        // exit if index not found
        if( isNaN(options.index) ) {
            return;
        }

        if(disableAnimation) {
            options.showAnimationDuration = 0;
        }

        // Pass data to PhotoSwipe and initialize it
        gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init();
    };

    $scope.onGalleryClick = function (e) {
        e = e || window.event;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;

        var eTarget = e.target || e.srcElement;

        // find root element of slide
        var clickedListItem = closest(eTarget, function(el) {
            return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
        });

        if(!clickedListItem) {
            return;
        }

        // find index of clicked item by looping through all child nodes
        // alternatively, you may define index via data- attribute
        var clickedGallery = clickedListItem.parentNode,
            childNodes = clickedListItem.parentNode.childNodes,
            numChildNodes = childNodes.length,
            nodeIndex = 0,
            index;

        for (var i = 0; i < numChildNodes; i++) {
            if(childNodes[i].nodeType !== 1) { 
                continue; 
            }

            if(childNodes[i] === clickedListItem) {
                index = nodeIndex;
                break;
            }
            nodeIndex++;
        }



        if(index >= 0) {
            // open PhotoSwipe if valid index found
            openPhotoSwipe( index, clickedGallery );
        }
        return false;
    }
}])

.directive('ionLazyImg', ['$http', '$timeout', '$compile', function($http, $timeout, $compile) {
    return {
        restrict:'E',
        replace:true,
        scope: {
            imgUrl: '@',
            imgClick: '&'
        },
        template: '<ion-spinner icon="circles"></ion-spinner>',
        link: function($scope, $element, $attrs) {
            $element.addClass('ion-lazy-img');
            var eClass=$attrs['class'];
            // $element.find('svg').addClass(eClass);
            var imgEl = $compile('<a href="large-image.jpg"><img src="{{imgUrl}}" class="ion-lazy-img"></img></a>')($scope);
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
