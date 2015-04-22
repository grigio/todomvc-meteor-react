FlowRouter.route('/:filter?', {
  subscriptions: function(params) {
    // subscribe at router or component level
  },

  action: function(params) {
    // We need to replace an existing React component if route has changed
    React.unmountComponentAtNode(document.getElementById('yield'));
    React.render(<TodoApp filter={params.filter} />, document.getElementById('yield'));
  }
});