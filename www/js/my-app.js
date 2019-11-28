// Initialize your app
var myApp = new Framework7();

// Export selectors engine
var $$ = Dom7;

//Detect type
var isAndroid = Framework7.prototype.device.android === true;
var isIos = Framework7.prototype.device.ios === true;

// Add view
myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});

// Login check
var userToken=window.localStorage.getItem("token");
var userEmail=window.localStorage.getItem("account");

if(userToken){
    $('.removeAuth').slideUp();
    $('.addAuth').slideDown();

    if(userEmail){
        $('.loginUser').html(userEmail);
    }
}

/*---------------------
index page
--------------------- */
myApp.onPageInit('index', function (page) {
    myApp.swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        paginationClickable: true,
        autoplay: 2500,
        autoplayDisableOnInteraction: false
    });
    myApp.swiper('.swiper-container2', {
        autoplay: 2500,
        autoplayDisableOnInteraction: false
    });
    myApp.swiper('.best-sellers', {
        //autoplay: 2500,
        autoplayDisableOnInteraction: false,
        nextButton: '.best-next',
        prevButton: '.best-prev',
    });

});

/*---------------------
cart page
--------------------- */
myApp.onPageInit('cart-page', function (page) {

    var apiEndPoint = "http://ec2-99-80-232-142.eu-west-1.compute.amazonaws.com:9080/";
    var cartEndpoint = apiEndPoint + "api/cart";

    if(userToken){
        setInterval(function(){
            $.ajax({
                'type': 'GET',
                'url': cartEndpoint,
                "headers": {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": "Bearer "+userToken
                },
                'dataType': 'json',
                'success': function (data, status) {
                    if(data && data.products && data.products.length!==0){

                        // Filled Cart => Add Cart Option
                        $('.cart-page .emptyCart').slideUp('fast');
                        $('.cart-page .cartOption').removeClass('removeFromCart');
                    }else{

                        // Empty Cart => Remove Cart Option
                        $('.cart-page .emptyCart').slideDown('fast');
                        $('.cart-page .cartOption').addClass('removeFromCart');
                    }
                },
                'error':function(e){

                }
            });
        },1000);
    }
});


(function ($) {
    "use strict";

    var apiEndPoint = "http://ec2-99-80-232-142.eu-west-1.compute.amazonaws.com:9080/";

    $(function () {
        //Logout
        $("#logoutAction").on('click',function(){
            window.localStorage.removeItem("token");
            window.localStorage.removeItem("account");

            location.reload();
        });

        //Login action
        $("#do_action_login").on('click', function () {
            var loginPopup = $('.login-screen');

            var loginMsg = loginPopup.find('.custom_msg');
            var loginLoader = loginPopup.find('.custom_loader');

            var loginEndpoint = apiEndPoint + "api/login";

            var apiEmail = loginPopup.find('#email_input').val();
            var apiPassword = loginPopup.find('#pw_input').val();

            //Reset
            loginMsg.slideUp('fast');
            loginMsg.html("");
            loginLoader.slideUp('fast');

            if (apiEmail && apiPassword) {
                loginLoader.slideDown('fast');
                loginMsg.html('Logging you in...');
                loginMsg.slideDown('fast');

                //Add API call
                var loginData = {};
                loginData['username'] = apiEmail;
                loginData['password'] = apiPassword;

                $.ajax({
                    'type': 'POST',
                    'url': loginEndpoint,
                    'contentType': 'application/json; charset=utf-8',
                    'data': JSON.stringify(loginData),
                    'dataType': 'json',
                    'success': function (data, status) {
                        if(data && data.token){
                            window.localStorage.setItem("token", data.token);
                            window.localStorage.setItem("account", data.account);
                            location.reload();
                        }
                    },
                    'error':function(e){
                        loginLoader.slideUp('fast');
                        loginMsg.html('Incorrect email and/or password');
                        loginMsg.slideDown('fast');
                    }
                });
            } else {
                loginMsg.html('Missing email and/or password');
                loginMsg.slideDown('fast');
            }
        });

        //Register action
        // $("#do_action_register").on('click', function () {
        //     var registerPopup = $('.popup-register');
        //
        //     var registerMsg = registerPopup.find('.custom_msg');
        //     var registerLoader = registerPopup.find('.custom_loader');
        //
        //     var registerEndpoint = apiEndPoint + "";
        //
        //     var apiEmail = registerPopup.find('#reg_email_input').val();
        //     var apiPassword = registerPopup.find('#reg_pw_input').val();
        //
        //     //Reset
        //     registerMsg.slideUp('fast');
        //     registerMsg.html("");
        //     registerLoader.slideUp('fast');
        //
        //     if (apiEmail && apiPassword) {
        //
        //         registerLoader.slideDown('fast');
        //         registerMsg.html('Creating your new account...');
        //         registerMsg.slideDown('fast');
        //
        //         //Add API call
        //         $.post(registerEndpoint, {
        //             email: apiEmail,
        //             password: apiPassword
        //         }).done(function (ret1) {
        //             if (ret1) {
        //                 var retData = ret1['ret_data'];
        //             }
        //         }).fail(function () {
        //         });
        //     } else {
        //         registerMsg.html('Missing email and/or password!');
        //         registerMsg.slideDown('fast');
        //     }
        // });
    });


})(jQuery);    

  