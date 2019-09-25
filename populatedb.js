#! /usr/bin/env node

//Updated from https://raw.githubusercontent.com/hamishwillee/express-locallibrary-tutorial/master/populatedb.js

console.log('This script populates some test categories and items to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0-mbdj7.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Category = require('./models/category')
var Item = require('./models/item')

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var categories = []
var items = []

function categoryCreate(name, description, cb) {
  categorydetail = {name: name , description: description }
  
  var category = new Category(categorydetail);
       
  category.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Category: ' + category);
    categories.push(category)
    cb(null, category)
  }  );
}

function itemCreate(name, description, category, price, number_in_stock, cb) {
  var item = new Item({ name: name, description: description, category: category, price: price, number_in_stock, number_in_stock });
       
  item.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Item: ' + item);
    items.push(item)
    cb(null, item);
  }   );
}

function createCategories(cb) {
    async.series([
        function(callback) {
            categoryCreate('Woods', 'When you need to hit it far', callback);
        },
        function(callback) {
            categoryCreate('Hybrids', 'When you need to hit it far, but not that far', callback);
        },
        function(callback) {
            categoryCreate('Irons', 'When you need to hit it medium', callback);
        },
        function(callback) {
            categoryCreate('Wedges', 'When you need to hit it short', callback);
        },
        function(callback) {
            categoryCreate('Putters', 'When you need to hit it very short', callback);
        },
        ],
        // optional callback
        cb);
}

function createItems(cb) {
    async.parallel([
        function(callback) {
            itemCreate('Driver', 'Loft: 9 degrees', categories[0], '300', '1', callback);
        },
        function(callback) {
            itemCreate('3 Wood', 'Loft: 15 degrees', categories[0], '275', '3', callback);
        },
        function(callback) {
            itemCreate('3 hybrid', 'Loft: 19 degrees', categories[1], '245', '3', callback);
        },
        function(callback) {
            itemCreate('4 hybrid', 'Loft: 22 degrees', categories[1], '220', '4', callback);
        },
        function(callback) {
            itemCreate('2 iron', 'Loft: 19 degrees', categories[2], '235', '2', callback);
        },
        function(callback) {
            itemCreate('3 iron', 'Loft: 23 degrees', categories[2], '215', '3', callback);
        },
        function(callback) {
            itemCreate('4 iron', 'Loft: 26 degrees', categories[2], '205', '4', callback);
        },
        function(callback) {
            itemCreate('5 iron', 'Loft: 29 degrees', categories[2], '200', '5', callback);
        },
        function(callback) {
            itemCreate('6 iron', 'Loft: 32 degrees', categories[2], '185', '6', callback);
        },
        function(callback) {
            itemCreate('7 iron', 'Loft: 35 degrees', categories[2], '175', '7', callback);
        },
        function(callback) {
            itemCreate('8 iron', 'Loft: 38 degrees', categories[2], '165', '8', callback);
        },
        function(callback) {
            itemCreate('9 iron', 'Loft: 42 degrees', categories[2], '155', '9', callback);
        },
        function(callback) {
            itemCreate('Pitching Wedge', 'Loft: 46 degrees', categories[3], '140', '0', callback);
        },
        function(callback) {
            itemCreate('Gap Wedge', 'Loft: 50 degrees', categories[3], '125', '15', callback);
        },
        function(callback) {
            itemCreate('Sand Wedge', 'Loft: 54 degrees', categories[3], '110', '15', callback);
        },
        function(callback) {
            itemCreate('Lob Wedge', 'Loft: 58 degrees', categories[3], '95', '15', callback);
        },
        function(callback) {
            itemCreate('Mallet Putter', 'Loft: 4 degrees', categories[4], '200', '5', callback);
        },
        function(callback) {
            itemCreate('Blade Putter', 'Loft: 4 degrees', categories[4], '200', '5', callback);
        },
        ],
        // optional callback
        cb);
}

async.series([
    createCategories,
    createItems,
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('Clubs: '+items);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});


