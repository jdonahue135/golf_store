var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ItemSchema = new Schema(
    {
        name: {type: String, required: true, max: 100},
        description: {type: String, required: true},
        category: {type: Schema.Types.ObjectId, ref: 'Category', required: true},
        price: {type: Number, required: true},
        number_in_stock: {type: Number, required: true}
    }
)

// Virtual for item's URL
ItemSchema
.virtual('url')
.get(function () {
  return '/catalog/item/' + this._id;
});

//Virtual for item's price in USD
ItemSchema
.virtual('usd')
.get(function() {
  return '$' + this.price;
});

//Export model
module.exports = mongoose.model('Item', ItemSchema);