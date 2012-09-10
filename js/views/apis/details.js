define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'router',
  'vm',
  'models/session',
  'text!templates/apis/details.html',
  'models/api',
  'collections/methods',
  'views/resource/list',
  'views/methods/details',
  'models/api',
  'models/resource',
  'models/method',
  'libs/highlight/highlight',
  'views/forms/resource'
], function($, _, Backbone, Bootstrap, Router, Vm, Session, apiDetailsTemplate, ApiModel, MethodsCollection, ResourceListView, MethodDetailView, ApiModel, ResourceModel, MethodModel, hljs, ResourceForm){
  var NewApiPage = Backbone.View.extend({
    el: '.page',
    initialize: function () {
      var that = this;
      
    },  
    events: {
      'click .js-new-resource': 'newResource',
      'click .js-new-method': 'newMethod'
    },
    newResource: function () {
      var resourceForm = Vm.create(this, 'resourceform', ResourceForm, {
        username: this.options.username,
        version: this.options.version,
        api: this.options.apiname
      });
      resourceForm.render();

      return false;
    },
    newMethod: function () {
      $('#js-new-method-modal').modal('show');
      return false;
    },
    saveMethod: function (ev) {
      var that = this;
      var methodData = $(ev.currentTarget).serializeObject();
      var methodModel = new MethodModel({
        username: this.options.username,
        version: this.options.version,
        api: this.options.apiname,
        resourceId: this.options.resourceId
      });
      methodModel.save(methodData, {
        success: function () {
          $('#js-new-method-modal').modal('hide');
          that.showMethodList();
        }
      });
      return false;
    },
    saveResource: function (ev) {
      var resourceData = $(ev.currentTarget).serializeObject();
      console.log(resourceData);
      var resourceModel = new ResourceModel({
        username: this.options.username,
        version: this.options.version,
        api: this.options.apiname
      });
      resourceModel.save(resourceData, {
        success: function () {
          console.log('oooo', arguments);
        }
      });
      return false;
    },
    showMethodList: function () {
      var that = this;
      var methodListView = new MethodsListView({username: that.options.username, api: that.options.apiname, version: that.options.version, resourceId: that.options.resourceId, method: that.options.method});
      methodListView.render();    
    },
    showDetails: function () {
      var that = this;
      console.log('show details');
      if($('.resource-list-container').attr('data-api-id') !== that.options.apiname) {
        var resourceListView = Vm.create(that, 'resourceListView', ResourceListView, {username: that.options.username, api: that.options.apiname, version: that.options.version, resourceId: that.options.resourceId, method: that.options.method});
        resourceListView.render();
        console.log('show list container');
      };
    // if(typeof that.options.resourceId !== 'undefined' && $('.method-list-container').attr('data-resource-id') !== that.options.resourceId) {
    //   that.showMethodList();           
    //}
    //  if(typeof that.options.method !== 'undefined') {
    //    var methodView = new MethodView({username: that.options.username, api: that.options.apiname, version: that.options.version, resourceId: that.options.resourceId, method: that.options.method});
    //     methodView.render();              
    //  }
    },
    render: function () { 
      var that = this;
      console.log('re-render');
      if($('.api-container').length === 0) {
        this.$el.html('Loading API');
      
        var apiModel = new ApiModel({username: this.options.username, apiname: this.options.apiname, version: this.options.version});

        apiModel.fetch({
          success: function (api) {
            console.log('hljf' , hljs)
            if($('.api-container').length === 0) {
              that.$el.html(_.template(apiDetailsTemplate, {api: api, errors: []}));
                
              $('code').each(function(i, e) {hljs.highlightBlock(e); });
                $('.js-api-pages a').click(function (e) {
                e.preventDefault();
                $(this).tab('show');
              });
            };
            that.showDetails();
             /*
            var owner = false;
            if(Session.get('user_id') === api.get('UserId')){
              owner = true;
            }
              that.$el.html(_.template(apiDetailsTemplate, {api: api, errors: []}));
              var methodsListView = Vm.create(that, 'methodslistview', MethodsListView, {apiId: that.options.apiId, owner: owner});
              methodsListView.render();
            
             if(typeof that.options.methodId !== 'undefined') {
                var methodDetailView = Vm.create(that, 'methoddetailview', MethodDetailView, {methodId: that.options.methodId, apiId: that.options.apiId, owner: owner});
                methodDetailView.render();
             }
             */
          }
        })
      } else {
         that.showDetails();

      }

    }
  });
  return NewApiPage;
});
