var app = app || {};

app.ALL_TODOS = 'all';
app.ACTIVE_TODOS = 'active';
app.COMPLETED_TODOS = 'completed';

var ENTER_KEY = 13;
// mount animation <ReactCSSTransitionGroup> from React namespace
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;


TodoApp = React.createClass({
	mixins: [ DDPMixin, ReactiveMixin ],

	subscriptions: function() {
	  return Meteor.subscribe("todos");
	},

	getReactiveState: function() {
		if ( this.subsReady() ) {
			// NOTE: when the route change the subscription
			// is ready but not the component
		 	this.isMounted() && this.setState({ready:true});
		}
		return {
		 	user: Meteor.user() && Meteor.user().emails[0].address,
		 	todos: Todos.find({}, {}).fetch()
		};
	},

	getInitialState: function () {
		return {
			ready: this.subsReady() || false,
			nowShowing: this.props.filter || app.ALL_TODOS,
			editing: null
		};
	},

	componentDidMount: function () {
	},

	handleNewTodoKeyDown: function (event) {
		if (event.which !== ENTER_KEY) {
			return;
		}

		event.preventDefault();

		var val = this.refs.newField.getDOMNode().value.trim();

		if (val) {
			this.refs.newField.getDOMNode().value = '';
			Todos.insert({title:val, completed:false});
		}
	},

	messageOrLoading: function () {
		return (this.state.ready) ? 'What needs to be done?' : 'loading..'
	},

	clearCompleted: function () {
		// NOTE: mass updates of multiple docs are done server-side
		var todos = this.state.todos;
		var ids = _.pluck(todos, '_id');

		Meteor.call('clearCompleted', ids);
	},

	toggleAll: function (event) {
		var checked = event.target.checked;

		var todos = this.state.todos;
		var ids = _.pluck(todos, '_id');

		Meteor.call('toggleAll', ids, checked);
	},

	toggle: function (todoToToggle) {
		Todos.update({_id:todoToToggle._id}, {$set:{completed:!todoToToggle.completed}});
	},

	destroy: function (todo) {
		Todos.remove({_id:todo._id});
	},

	edit: function (todo) {
		this.setState({editing: todo._id});
	},

	save: function (todoToSave, text) {
		Todos.update({_id:todoToSave._id}, {$set:{title:text}});
		this.setState({editing: null});
	},

	cancel: function () {
		this.setState({editing: null});
	},

	render: function () {

			var footer;
			var main;
			var todos = this.state.todos;

			var shownTodos = todos.filter(function (todo) {
				switch (this.state.nowShowing) {
				case app.ACTIVE_TODOS:
					return !todo.completed;
				case app.COMPLETED_TODOS:
					return todo.completed;
				default:
					return true;
				}
			}, this);

			var todoItems = shownTodos.map(function (todo) {
				return (
					<TodoItem
						key={todo._id}
						title={todo.title}
						todo={todo}
						onToggle={this.toggle.bind(this, todo)}
						onDestroy={this.destroy.bind(this, todo)}
						onEdit={this.edit.bind(this, todo)}
						editing={this.state.editing === todo._id}
						onSave={this.save.bind(this, todo)}
						onCancel={this.cancel}
					/>
				);
			}, this);


			var activeTodoCount = todos.reduce(function (accum, todo) {
				return todo.completed ? accum : accum + 1;
			}, 0);

			var completedCount = todos.length - activeTodoCount;

			if (activeTodoCount || completedCount) {
				footer =
					<TodoFooter
						count={activeTodoCount}
						completedCount={completedCount}
						nowShowing={this.state.nowShowing}
						onClearCompleted={this.clearCompleted}
					/>;
			}

			if (todos.length) {
				main = (
					<section id="main">
						<input
							id="toggle-all"
							type="checkbox"
							onChange={this.toggleAll}
						/>
						<ul id="todo-list">
							<ReactCSSTransitionGroup transitionName="example">
								{todoItems}
							</ReactCSSTransitionGroup>
						</ul>
					</section>
				);
			}

		return (
			<div>
				<header id="header">
					<h1>todos</h1>
					<input
						ref="newField"
						id="new-todo"
						placeholder={this.messageOrLoading()}
						onKeyDown={this.handleNewTodoKeyDown}
						autoFocus={true}
					/>
				</header>
				{main}
				{footer}
			</div>
		);
	}
});