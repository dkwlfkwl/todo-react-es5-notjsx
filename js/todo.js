var createElement = React.createElement;

function Form(props) {
	var insertNewTodo = props.insertNewTodo;
	var refInput = React.createRef();

	function submitHandler(e) {
		if(e.type === 'keypress') {
			if(e.key !== 'Enter' || refInput.current.value === '') {
				return false;
			}
		} else {
			if(refInput.current.value === '') {
				return false;
			}
		}

		insertNewTodo(refInput.current.value);

		refInput.current.value = '';
		refInput.current.focus();
	}

	var Input = createElement('input', { ref: refInput, type: 'text', className: 'new-todo', onKeyPress: submitHandler });
	var Submit = createElement('button', { type: 'submit', className: 'btn-submit', onClick: submitHandler }, '등록');

	return createElement(
		'div',
		{
			className: 'header',
		},
		Input,
		Submit
	);
}

function List(props) {
	return createElement(
		'ul',
		{
			className: 'list'
		},
		props.todos.map(function(item) {
			return Item({
				todos: item,
				moveTodo: props.moveTodo,
				changeCompleted: props.changeCompleted,
				deleteTodo: props.deleteTodo
			});
		})
	);
}

function Item(props) {
	function moveTodoHandler(dir) {
		props.moveTodo(props.todos.id, dir);
	}
	function changeCompletedHandler() {
		props.changeCompleted(props.todos.id);
	}
	function deleteTodoHandler() {
		props.deleteTodo(props.todos.id)
	}

	var BtnUpTodo = createElement('button', { className: 'btn-up', onClick: moveTodoHandler.bind(this, -1) }, '위로');
	var BtnDownTodo = createElement('button', { className: 'btn-down', onClick: moveTodoHandler.bind(this, 1) }, '아래로');
	var BtnChangeCompleted = createElement('button', { className: 'btn-completed', onClick: changeCompletedHandler }, '토글');
	var BtnDeleteTodo = createElement('button', { className: 'btn-delete', onClick: deleteTodoHandler }, '삭제');

	return createElement(
		'li',
		{
			key: props.todos.id,
			// id: props.todos.id,
			className: props.todos.completed ? 'completed' : '',
		},
		props.todos.text,
		BtnUpTodo,
		BtnDownTodo,
		BtnChangeCompleted,
		BtnDeleteTodo
	);
}

function Todo() {
	var todoList = JSON.parse(localStorage.getItem('todolist')) || [];

	this.state = {
		todos: todoList
	}
}

Todo.prototype.componentDidUpdate = function(nextProps, nextState) {
	localStorage.setItem('todolist', JSON.stringify(this.state.todos));
}

Todo.prototype.render = function() {
	return createElement(
		'div',
		{
			className: 'todo',
		},
		Form({
			insertNewTodo: this.insertNewTodo.bind(this)
		}),
		List({
			todos: this.state.todos,
			moveTodo: this.moveTodo.bind(this),
			changeCompleted: this.changeCompleted.bind(this),
			deleteTodo: this.deleteTodo.bind(this)
		})
	);
}

Todo.prototype.insertNewTodo = function(value) {
	var newItem = {
		id: new Date().valueOf(),
		text: value.trim(),
		completed: false
	};

	this.setState(function(state) {
		return {
			todos: state.todos.concat(newItem)
		}
	});
}

Todo.prototype.deleteTodo = function(id) {
	this.setState(function(state) {
		return {
			todos: state.todos.filter(function(item) {
				return item.id !== id;
			})
		}
	});
}

Todo.prototype.changeCompleted = function(id) {
	this.setState(function(state) {
		return {
			todos: state.todos.map(function(item) {
				if(item.id === id) {
					item.completed = !item.completed;
					return item;
				} else {
					return item;
				}
			})
		}
	});
}

Todo.prototype.moveTodo = function(id, dir) {
	var targetId = id;
	var direction = dir;
	var targetIndex;
	var insertIndex;

	var targetIndex = this.state.todos.findIndex(function(item) {
		return item.id === targetId;
	});

	if(targetIndex >= 0) {
		insertIndex = targetIndex + direction;
	} else {
		insertIndex = targetIndex
	}

	this.setState(function(state) {
		state.todos.splice(insertIndex, 0, state.todos.splice(targetIndex, 1)[0]);

		return {
			todos: state.todos
		}
	});
}

Object.setPrototypeOf(Todo.prototype, React.Component.prototype);

ReactDOM.render(React.createElement(Todo), document.getElementById('root'));