var Category = require('../models/category');
var Item = require('../models/item');

var async = require('async');

exports.index = function(req, res) {
    async.parallel({
        item_count: function(callback) {
            Item.countDocuments({}, callback); //Pass an empty object as match condition to find all documents of this collection
        },
        category_count: function(callback) {
            Category.countDocuments({}, callback);
        }
    }, function(err, results) {
        res.render('index', {title: 'Golf Store Home', error: err, data: results });
    });
};

//Display list of all Categories.
exports.category_list = function(req, res) {
    Category.find({}, 'name')
    .exec(function (err, list_categories) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('category_list', { title: 'Categories', category_list : list_categories });
    });
};

// Display detail page for a specific Category.
exports.category_detail = function(req, res, next) {
    console.log('we get to this function');
    async.parallel({
        category: function(callback) {
            Category.findById(req.params.id)
                .exec(callback);
        },

        category_items: function(callback) {
            Item.find({ 'category': req.params.id })
                .exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.category==null) { //No results.
            var err = new Error('Category not found');
            err.status = 404;
            return next(err);
        }
        //Successful, so render
        res.render('category_detail', { title: 'Category Detail', category: results.category, category_items: results.category_items } );
    });

};

// Display category create form on GET.
exports.category_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: category create GET');
};

// Handle category create on POST.
exports.category_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: category create POST');
};

// Display category delete form on GET.
exports.category_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: category delete GET');
};

// Handle category delete on POST.
exports.category_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: category delete POST');
};

// Display category update form on GET.
exports.category_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: category update GET');
};

// Handle category update on POST.
exports.category_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: category update POST');
};