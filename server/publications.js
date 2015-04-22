Meteor.publish("todos", function() {
	// publish private todos only to authenticated users
	var filter = (this.userId) ? {} : {private: {$ne: true} } ;
	return Todos.find(filter);
});

// autoseed
if (Todos.find({private: true}).count() === 0){
	Todos.insert({title:'Secret note1', completed:false, private:true});
	Todos.insert({title:'Secret note2', completed:false, private:true});
}