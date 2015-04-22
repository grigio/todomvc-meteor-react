Meteor.methods({
	'toggleAll': function (ids, checked) {
		check(ids, [String]);
		check(checked, Boolean);

		Todos.update({_id: {$in: ids}},
						   {$set: {completed: checked}}, {multi:true});
	},

	'clearCompleted':function(ids){
		check(ids, [String]);

		Todos.remove({_id: {$in: ids}, completed: true });
	}
});