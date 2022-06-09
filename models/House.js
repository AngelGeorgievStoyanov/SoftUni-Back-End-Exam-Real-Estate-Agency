const { Schema, model } = require('mongoose');

const schema = new Schema({
  name: { type: String, required: [true, 'Name of House is required'], minLength: [4, 'Name must be at least 4 characters'] },
  type: { type: String, required: [true, 'Type of villa is required'] },
  year: { type: Number, required: [true, 'Years is required'], min: [1850, 'Years must be between 1850 and 2021'], max: [2021, 'Years must be 2021'] },
  city: { type: String, required: [true, 'Name of City is required'], minLength: [4, 'Name of City must be at least 4 characters'] },
  imageUrl: { type: String, required: [true, 'House image is required'], match: [/^https?/, 'Hotel Image must be a valid URL'] },
  description: { type: String, required: [true, 'Description is required'], maxLength: [60, 'Description should be a maximum of 60 characters long'] },
 
  rooms: { type: Number, required: [true, 'Pieces is required'], min: [0, 'Pieces must be 0-10'], max: [10, 'Rooms must be 0-10'] },
  creator: { type: Schema.Types.ObjectId, ref: 'User' },
  bookeds: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],

});

module.exports = model('House', schema);