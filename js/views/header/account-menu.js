define([
  'jquery',
  'underscore',
  'backbone',
  'vm',
  'models/session',
  'text!templates/header/account-menu.html',
  'views/home/login',
  'views/home/register',
  'fallr',
  'qtip',
  'text!templates/header/account-menu-dropdown.html'
], function($, _, Backbone, Vm, Session, mainMenuTemplate, LoginView, RegisterView, fallr, qtip, accountDropdown){
  var MainMenuView = Backbone.View.extend({
    el: '.account-menu-container',
    initialize: function () {
      var that = this;

      $('body').on('click', '.js-logout', function () {
        console.log('hooooo');
        that.logout();
      });

      Session.on('change:auth', function (session) {
        that.render();

      });
      Session.on('change:errors', function (errors) {
        that.render();
      });
    },
    render: function () {
      if(typeof Session.get('auth') !== 'undefined') {
        if(Session.get('auth')){
          
          this.$el.html(_.template(mainMenuTemplate, {user: Session}));
        } else {
          
          this.$el.html(_.template(mainMenuTemplate, {user: null}));
        }
        this.$el.fadeIn(200);
      }
    },
    events: {
      'click .signup': 'signup',
      'click .logout': 'logout',
      'click .login': 'login',
      'click .js-account-menu': 'dropdownMenu'
    },
    dropdownMenu: function (ev) {
      $(ev.currentTarget).qtip({
        content: {
          text: accountDropdown
        },
        show: {
          event: false, // Don't specify a show event...
          ready: true // ... but show the tooltip when ready
        },
      hide: {
        delay: 100,
        event: 'unfocus mouseleave',
        fixed: true // Make sure we can interact with the qTip by setting it as fixed
      },
      position: {
        my: "top right",
        at: "bottom center"
      },
        style: {
    classes: 'ui-tooltip-dark ui-tooltip-shadow'
  }
      });


    },
    logout: function (ev) {
      console.log('logged out');
      // Disable the button
      Session.logout();
      Backbone.router.navigate('', true);

    },
    login: function (ev) {
      var loginView = Vm.create(this, 'LoginView', LoginView, {});
      loginView.render();
    },
    signup: function (ev) {
      var registerView = Vm.create(this, 'RegisterView', RegisterView, {});
      registerView.render();
    }
  });
  return MainMenuView;
});
