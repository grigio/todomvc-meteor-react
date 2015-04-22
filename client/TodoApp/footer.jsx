TodoFooter = React.createClass({
	render: function () {
		var activeTodoWord = 'items';
		var clearButton = null;

		if (this.props.completedCount > 0) {
			clearButton = (
				<button
					id="clear-completed"
					onClick={this.props.onClearCompleted}>
					Clear completed ({this.props.completedCount})
				</button>
			);
		}
		return (
			<footer id="footer">
					<span id="todo-count">
						<strong>{this.props.count}</strong> {activeTodoWord} left
					</span>
					<ul id="filters">
						<li>
							<a
								href="/"
								className="">
									All
							</a>
						</li>
						{' '}
						<li>
							<a
								href="/active"
								className="">
									Active
							</a>
						</li>
						{' '}
						<li>
							<a
								href="/completed"
								className="">
									Completed
							</a>
						</li>
					</ul>
					{clearButton}
				</footer>
		);
	}
});
