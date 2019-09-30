var Item = require('../models/item');
var Category = require('../models/category');


const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

//Display list of all Items.
exports.item_list = function(req, res, next) {
    Item.find({}, 'name')
    .exec(function (err, list_items) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('item_list', { title: 'Club List', item_list : list_items });
    });
};

// Display detail page for a specific item.
exports.item_detail = function(req, res, next) {
    
    Item.findById(req.params.id)
    .populate('category')
    .exec(function (err, item) {
        if (err) { return next(err); }
        if (item==null) { //No results.
            var err = new Error('Club not found');
            err.status = 404;
            return next(err);
        }
    // Seccessful, so render.
    res.render('item_detail', { title: 'Club: '+item.name, item: item});
    })
};

// Display item create form on GET.
exports.item_create_get = function(req, res, next) {
    // Display all categories
    Category.find({}, 'name')
    .exec(function (err, list_categories) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('item_form', { title: 'Create Club', categories : list_categories });
    });
};

// Handle item create on POST.
exports.item_create_post = [

    //Validate fields.
    body('name').isLength({ min: 1 }).trim().withMessage('Name must be specified.'),
    body('description').isLength({ min: 1 }).trim().withMessage('Description must be specified.'),
    body('category').isLength({ min: 1 }).trim().withMessage('Category must be specified'),
    body('price').isLength({ min: 1 }).trim().withMessage('Price must be specified'),
    body('number_in_stock').isLength({ min: 1 }).trim().withMessage('Number in stock must be specified'),
    
    // Sanitize fields (using wildcard).
    sanitizeBody('*').escape(),

    //Process request after validation and sanitization.
    (req, res, next) => {

        //Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            //There are errors. Render form again with sanitized values/errors messages.
            Category.find({}, 'name')
                .exec(function (err, list_categories) {
                    if (err) { return next(err); }

                    res.render('item_form', { title: 'Create Item', categories: list_categories, item: req.body, errors: errors.array() });
                    return;
            });
        }    
        else {
            //Data from form is valid.

            //Create an Item object with escaped and trimmed data.
            var item = new Item(
                {
                    name: req.body.name,
                    description: req.body.description,
                    category: req.body.category,
                    price: req.body.price,
                    number_in_stock: req.body.number_in_stock
                });
            item.save(function (err) {
                if (err) { return next(err); }
                //Successful - redirect to new Item record.
                res.redirect(item.url);
            });
        }
    }
];

// Display item delete form on GET.
exports.item_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: item delete GET');
};

// Handle item delete on POST.
exports.item_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: item delete POST');
};

// Display item update form on GET.
exports.item_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: item update GET');
};

// Handle item update on POST.
exports.item_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: item update POST');
};