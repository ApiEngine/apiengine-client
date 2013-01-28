define([
  'jquery',
  'underscore',
  'backbone',
  'router',
  'vm',
  'mustache',
  'qtip',
  'models/session',
  'text!templates/apis/details.html',
  'models/api',
  'models/api-overview',
  'libs/highlight/highlight',
  'modal',
  'text!templates/modals/editdescription.html',
  'views/apis/overview',
  'views/apis/documentation',
  'views/apis/settings',
  'views/apis/collaborators'
], function($, _, Backbone, Router, Vm,  Mustache, Qtip, Session, apiDetailsTemplate, ApiModel, ApiSummary, hljs, Modal, edt, OverView, DocsView, SettingsView, CollaboratorsView){
  var NewApiPage = Backbone.View.extend({
    el: '.page',
    initialize: function () {
      var that = this;

    },
    events: {
      'click .edit-api-description': 'editDescription'
    },
    editDescription: function(ev) {
      var modal = Modal.create({
        content: edt,
        inline: {
          from: $(ev.currentTarget),
          to: '.xx'
        }
      });
      $('.editdescription').on('submit', function(ev) {
        console.log('asd');
        var api = new ApiModel({
          username: 'thomasdavis',
          apiname: 'ApiEngine',
          version: 1
        });
        var apiDetails = $(ev.currentTarget).serializeObject();
        apiDetails.name = 'ApiEngine';
        api.save(apiDetails, {
          success: function (model) {

          }
        })
        return false;
      });
      window.modal = modal;
    },
    render: function () {
      var that = this;

      if($('.api-container').length === 0) {
        this.$el.html('');

        var apiModel = new ApiSummary({username: this.options.username, apiname: this.options.apiname, version: this.options.version});

        apiModel.fetch({
          success: function (api) {
            if($('.api-container').length === 0) {
              var owner = Session.get('login') === api.get('user') ? true : false;
              console.log('why no api', api)
              that.$el.html(Mustache.render(apiDetailsTemplate, {api: api, errors: [], owner: owner}));
              if(that.options.version) {
                var docsView = Vm.create(that, 'apitab', DocsView, that.options);
                docsView.render({api: api});

              }
              if(that.options.settings) {
                var settingsView = Vm.create(that, 'apitab', SettingsView, that.options);
                settingsView.render();
              }   
               if(that.options.collaborators) {
                var collaboratorsView = Vm.create(that, 'apitab', CollaboratorsView, that.options);
                collaboratorsView.render();
              }
          }
        }
        })
      } else {

               if(that.options.version) {
                var docsView = Vm.create(that, 'apitab', DocsView, that.options);
                docsView.render({api: api});

              }
              if(that.options.settings) {
                var settingsView = Vm.create(that, 'apitab', SettingsView, that.options);
                settingsView.render();
              }

              if(that.options.collaborators) {
                var collaboratorsView = Vm.create(that, 'apitab', CollaboratorsView, that.options);
                collaboratorsView.render();
              }
      }
     
    }
  });
  return NewApiPage;
});
