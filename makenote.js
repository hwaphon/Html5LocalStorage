/*
 * @Author: hwaphon
 * @Date:   2016-12-16 18:03:51
 * @Last Modified by:   hwaphon
 * @Last Modified time: 2016-12-16 20:17:12
 */

'use strict';

window.onload = init;

function init() {
	var takeNoteButton = document.getElementById("take-note");
	takeNoteButton.onclick = createNote;

	var notesArray = getNotesArray();

	for (var i = 0; i < notesArray.length; i++) {
		var key = notesArray[i];
		var value = JSON.parse(localStorage.getItem(key));
		addNoteToDOM(key, value);
	}
}

function addNoteToDOM(key, noteObj) {
	var notes = document.getElementById("note-list");
	var note = document.createElement("li");
	note.setAttribute("id", key);
	note.onclick = deleteNote;

	var value = noteObj.value;
	note.innerHTML = value;

	var level = noteObj.level;
	note.setAttribute("class", level);
	notes.appendChild(note);
}


function deleteNote(e) {
	var key = e.target.id;
	localStorage.removeItem(key);
	var notesArray = getNotesArray();

	for (var i = 0; i < notesArray.length; i++) {
		if (key === notesArray[i]) {
			notesArray.splice(i, 1);
		}
	}
	localStorage.setItem("notesArray", JSON.stringify(notesArray));

	deleteNoteFromDOM(key);
}

function deleteNoteFromDOM(key) {
	var note = document.getElementById(key);
	note.parentNode.removeChild(note);
}

function createNote() {
	var noteElement = document.getElementById("note");
	var noteValue = noteElement.value;
	noteElement.value = "";

	var levelObj = document.getElementById("note-level");
	var index = levelObj.selectedIndex;
	var level = levelObj[index].value;

	var noteObj = {
		"value": noteValue,
		"level": level
	}

	var date = new Date();
	var key = "note_" + date.getTime();
	localStorage.setItem(key, JSON.stringify(noteObj));

	var notesArray = getNotesArray();
	notesArray.push(key);
	localStorage.setItem("notesArray", JSON.stringify(notesArray));

	addNoteToDOM(key, noteObj);
}

function getNotesArray() {
	var notesArray = localStorage.getItem("notesArray");

	if (!notesArray) {
		notesArray = [];
		localStorage.setItem("notesArray", JSON.stringify(notesArray));
	} else {
		notesArray = JSON.parse(notesArray);
	}

	return notesArray;
}
