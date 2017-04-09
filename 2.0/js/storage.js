/*
* @Author: hwaphon
* @Date:   2017-04-09 10:20:15
* @Last Modified by:   hwaphon
* @Last Modified time: 2017-04-09 18:07:44
*/
(function() {
	var inputContent = document.getElementById("input-content"),
		taskTitle = document.getElementById("task-title"),
		taskDesc = document.getElementById("task-desc"),
		taskDate = document.getElementById("task-date"),
		taskSubmit = document.getElementById("task-submit"),
		taskDetail = document.getElementById("task-detail"),
		confirmButton = document.getElementById("confirm"),
		cancelButton = document.getElementById("cancel"),
		listContent = document.getElementById("list-content"),
		deleteAlert = document.getElementById("delete-alert"),
		deleteConfirm = document.getElementById("delete-confirm"),
		deleteCancel = document.getElementById("delete-cancel"),
		list = listContent.children;

	var EventHandler = (function() {
		function addHandler(element, type, handler) {
			if (element.addEventListener) {
				element.addEventListener(type, handler, false);
			} else if(element.attachEvent) {
				element.attachEvent("on" + type, handler);
			} else {
				element["on" + type] = handler;
			}
		}

		function removeHandler(element, type, handler) {
			if(element.removeEventListener) {
				element.removeEventListener(type, handler, false);
			} else if (element.detachEvent) {
				element.detachEvent("on" + type, handler);
			} else {
				element["on" + type] = null;
			}
		}

		function getEvent(event) {
			return event? event : window.event;
		}

		function getTarget(event) {
			var event = getEvent(event);
			return event.target || event.srcElement;
		}



		return {
			"addHandler": addHandler,
			"removeHandler": removeHandler,
			"getEvent": getEvent,
			"getTarget": getTarget
		};
	})();

	var NoteControl = (function() {
		var Note = function(title, desc) {
			this.title = title;
			this.desc = desc;
			this.date = "";
		};

		var addNoteToDOM = function(note, noteKey) {
			var title = note.title;

			var liElement = document.createElement("li");
			liElement.classList.add("task-item");
			liElement.setAttribute("id", noteKey);

			liElement.innerHTML = '<span class="content">' + title + "</span>" +
								  '<span class="edit"></span>' +
								  '<span class="delete"></span>';
			listContent.insertBefore(liElement, listContent.firstElementChild);
			return liElement;
		};

		var deleteFromDOM = function(liElement) {
			listContent.removeChild(liElement);
		};

		var getKeysArray = function() {
			var keysArray = localStorage.getItem("noteKeysArray");

			if (!keysArray) {
				keysArray = [];
				localStorage.setItem("noteKeysArray", keysArray);
			} else {
				keysArray = JSON.parse(keysArray);
			}

			return keysArray;
		};

		function showAllNotes() {
			var noteKeysArray = getKeysArray(),
				length = noteKeysArray.length,
				note, key;

			for(var i = 0; i < length; i++) {
				key = noteKeysArray[i];
				note = JSON.parse(localStorage.getItem(key));
				var liElement = addNoteToDOM(note, key);
			}
		}

		function saveNote(title, desc) {
			var note = new Note(title, desc),
				noteKey = "note_" + new Date().getTime(),
				keysArray = getKeysArray();

			keysArray.push(noteKey);
			localStorage.setItem("noteKeysArray", JSON.stringify(keysArray));
			localStorage.setItem(noteKey, JSON.stringify(note));

			var liElement = addNoteToDOM(note, noteKey);
		}

		function deleteNote(liElement) {
			var keysArray = getKeysArray(),
				key = liElement.id,
				length = keysArray.length;

			localStorage.removeItem(key);
			for(var i = 0; i < length; i++) {
				if (keysArray[i] === key) {
					keysArray.splice(i, 1);
				}
			}
			localStorage.setItem("noteKeysArray", JSON.stringify(keysArray));
			deleteFromDOM(liElement);
		}

		function saveNoteById(id, note) {
			localStorage.setItem(id, JSON.stringify(note));
		}

		function getNoteById(id) {
			return JSON.parse(localStorage.getItem(id));
		}

		return {
			"saveNote": saveNote,
			"showAllNotes": showAllNotes,
			"deleteNote": deleteNote,
			"getNoteById": getNoteById,
			"saveNoteById": saveNoteById
		};
	})();

	function save() {
		var title = inputContent.value;
		if(title.trim() !== "") {
			NoteControl.saveNote(title, "");
			inputContent.classList.remove("invalid");
			inputContent.setAttribute("placeholder", "请输入要保存的内容");
		} else {
			inputContent.classList.add("invalid");
			inputContent.setAttribute("placeholder", "内容为空，请重新输入");
		}

		inputContent.value = "";
	}

	function deleteNote(e) {
		var target = EventHandler.getTarget(e);

		if(target.className !== "delete") {
			return;
		}

		deleteAlert.classList.add("show");

		EventHandler.addHandler(deleteConfirm, "click", function() {		
			for(var i = 0; i < list.length; i++) {
				if(list[i].id === target.parentNode.id) {
					NoteControl.deleteNote(list[i]);
					break;
				}
			}
			deleteAlert.classList.remove("show");
		});

		EventHandler.addHandler(deleteCancel, "click", function() {
			deleteAlert.classList.remove("show");
		})
	}

	function editNote(e) {
		var target = EventHandler.getTarget(e),
			noteID = target.parentNode.id;

		if(target.className !== "edit") {
			return;
		}

		taskDetail.classList.add("show");
		var note = NoteControl.getNoteById(noteID);
		taskTitle.innerHTML = note.title;
		taskDesc.value = note.desc;
		taskDate.value = note.date;

		EventHandler.addHandler(confirmButton, "click", change);

		EventHandler.addHandler(cancelButton, "click", function() {
			taskDetail.classList.remove("show");
			EventHandler.removeHandler(confirmButton, "click", change);
		});

		function change() {
			note.desc = taskDesc.value;
			note.date = taskDate.value;
			NoteControl.saveNoteById(noteID, note);
			taskDetail.classList.remove("show");
			EventHandler.removeHandler(confirmButton, "click", change);
		}
	}

	EventHandler.addHandler(taskSubmit, "click", save);
	EventHandler.addHandler(listContent,"click", deleteNote);
	EventHandler.addHandler(listContent, "click", editNote);
	NoteControl.showAllNotes();

})();