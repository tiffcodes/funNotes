const app = {};
app.notes = [];
app.apiUrl = "http://localhost:3500/notes";

app.getNotes = () => {
	return fetch(app.apiUrl)
		.then(res => res.json());
};

app.createNote = (note) => {
	return fetch(app.apiUrl, {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(note)
	})
	.then(res => res.json());
}

app.displayNotes = () => {
	//Find the app container
	//And put some stuff in there.
	const container = document.getElementById('app');
	container.innerHTML = '';
	const html = app.notes.map((note) => {
		return (`
			<article>
				<i class="fa fa-times" data-noteId="${note._id}"></i>
				<h2>${note.title}</h2>
				<p>${note.body}</p>
			</article>
		`)
	})
	.reverse()
	.join('');
	container.innerHTML = html;
};

app.removeNote = (id) => {
	return fetch(`${app.apiUrl}/${id}`,{
		method: 'DELETE',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
	})
	.then(res => res.json());
};

app.events = () => {
	const ourForm = document.querySelector('.new-note');
	
	ourForm.addEventListener('submit', (e) => {
		e.preventDefault();
		const title = document.querySelector('input[name="title"]').value;
		const body = document.querySelector('textarea').value;
		app.createNote({
			title,
			body
		})
		.then((res) => {
			app.notes.push(res.note);
			app.displayNotes();
		});
	});


	document.querySelector('#app').addEventListener('click',(e) => {
		if(e.target.className === 'fa fa-times') {
			const notesId = e.target.dataset.noteId;
			app.removeNote(notesId)
				.then((res) => {
					if(res.success) {
						//Remove the note from our page
						app.notes = app.notes.filter((note) => {
							return note._id !== notesId ? true : false;
						});
						app.displayNotes();
					}
				});
		}
	});
};

app.init = () => {
	app.getNotes()
		.then((res) => {
			app.notes = res.notes;
			app.displayNotes();
		});

	app.events();
};

window.onload = app.init;