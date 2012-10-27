define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'router',
  'vm',
  'models/session',
  'text!templates/profile/page.html',
  'models/api',
  'views/apis/list',
  'models/user',
  'text!templates/404.html',
  'views/header/newapi'

], function($, _, Backbone, bootstrap, Router, Vm, Session, newApiTemplate, ApiModel, ApisList, UserModel, MissingPage, NewApiView){
  var NewApiPage = Backbone.View.extend({
    el: '.page',
    initialize: function () {
      var that = this;
      this.userModel = new UserModel({id: this.options.username});
      this.userModel.on('change', function(userModel) {
        that.renderProfile();
      });
    },  
    events: {
      'submit form.edit-api': 'editApi'
    },
    editApi: function (ev) {
      $('[type=submit]', ev.currentTarget).text('Creating API').attr('disabled', 'disabled');
      // Serialize the form into an object using a jQuery plgin
      var apiData = $(ev.currentTarget).serializeObject();
      var api = new ApiModel;
      console.log(apiData);
      api.save(apiData, {
        success: function (model) {
          console.log(model);
          window.location = '#/apis/' + model.id;
        }
      });
      return false;
    },
    events: {
      'click .js-newapi': 'newapi',
      'click .js-edit-profile': 'editProfile',
      'submit .js-save-profile-form': 'saveProfile'
    },
    editProfile: function (ev) {
      $('#js-edit-profile-form').modal('show');
    },  
    saveProfile: function (ev) {
      var that = this;
      this.userModel.set($(ev.currentTarget).serializeObject());
      if(this.userModel.get('publicize') === 'true') { 
        this.userModel.set({publicize: true});
      } else {
        this.userModel.set({publicize: false});

      }
      this.userModel.id = this.options.username;
      this.userModel.save({}, {
        success: function(resp){
          
        }
      });
      return false;
    },
    render: function () {
      var that = this;
      this.userModel.fetch({
        success: function (user) {
          
        },
        error: function () {
          that.$el.html(MissingPage);
        }
      });
    },
    renderProfile: function () {
      $('#js-edit-profile-form').modal('hide');

      var that = this;
      currentUser = false;
      if(Session.get('login') === that.options.username ) { 
        currentUser = true;
      }
      that.$el.html(_.template(newApiTemplate, {user: that.userModel}));
      var apisList = new ApisList({currentUser: currentUser, username: that.options.username, el: '.private-container'});
      apisList.render();
    },
    newapi: function () {
      var newApiView = Vm.create(this, 'NewApiView', NewApiView, {});
      newApiView.render();
    }
  });
  return NewApiPage;
});
