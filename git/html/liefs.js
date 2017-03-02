var mylist = ["one", "two", "three"];

function liefs() {
  var tt = "yup";
  return "Hello World";
}

liefs[Symbol.iterator] = function() {
  return { // this is the iterator object, returning a single element, the string "bye"
    next: function() {
      var keys = Item.keys();
      if (this._index < keys.length ) {
        this._index += 1;
        return { value: tem.get(keys[this._index - 1]), done: false };
      } else {
        return { done: true };
      }
    },
    _index: 0
  };
};

itemIterate = function() {
  var item = this;
  return { // this is the iterator object, returning a single element, the string "bye"
    next: function() {
      var keys = Item.keys();
      if (this._index < keys.length ) {
        this._index += 1;
        return { value: Item.get(keys[this._index - 1]), done: false };
      } else {
        return { done: true };
      }
    },
    _index: 0
  };
};
