const mongoose = require('mongoose');

const url = process.env.DB_URI;

module.exports = function() {
  mongoose.connect(
    url,
    { 
      useNewUrlParser: true, 
      useUnifiedTopology: true, 
      useCreateIndex: true, 
      useFindAndModify: false
    },
    err => {
      if (err) {
        console.error('Database connection error');
        console.error(err);
        return;
      }

      console.info('Connected to database');
    }
  );
}