const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

mongoose.connect('mongodb://localhost/funnotes');

const Schema = mongoose.Schema;

const notesModel = new Schema({
	title: 'string',
	body: 'string',
	date_created: 'number'
});

const notes = mongoose.model('Note',notesModel);

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', true);
  	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Content-length, Accept, x-access-token');
  	res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    next();
}); 

app.use(express.static('.'));

app.use(bodyParser.json());

// app.get('/',(req,res) => {
// 	res.send('Working request!');
// });

app.get('/notes', (req,res) => {
	notes.find({},(err, docs) => {
		if(err) {
			res.send({
				error: err
			});
			return; 
		}
		res.send({
			notes: docs
		});
	});
});

app.get('/notes/:id', (req,res) => {
	const id = req.params.id;
	notes.findOne({ _id : id }, (err,doc) => {
		if(err) {
			res.send({
				error: err
			});
			return;
		}
		res.send({
			note: doc
		});
	});
});

app.post('/notes', (req,res) => {
	const data = req.body;
	data.date_created = +new Date();
	if(data.title === '' || data.body === '') {
		res.send({
			error: 'Make sure title and body are filled out'
		});
		return;
	}
	new notes(data).save((err,doc) =>{
		if(err) {
			res.send({
				error: err
			});
			return;
		}
		res.send({
			note: doc
		});
	});
});

app.put('/notes/:id', (req,res) => {
	const id = req.params.id;
	const data = req.body;
	notes.findOne({ _id: id },(err,doc) => {
		if(err) {
			res.send({
				error: err
			});
			return;
		}
		Object.assign(doc,data);
		doc.save((err,doc) => {
			if(err) {
				res.send({
					error: err
				});
				return;
			}
			res.send({
				note: doc
			});
		});	
	});
});

app.delete('/notes/:id', (req,res) => {
	const id = req.params.id;
	notes.findOneAndRemove({ _id: id }, (err,doc) => {
		if(err) {
			res.send({
				error: err
			});
			return;
		}
		res.send({
			success: true
		});
	});
});

app.listen('3500');
console.log("App is listening on port 3500");