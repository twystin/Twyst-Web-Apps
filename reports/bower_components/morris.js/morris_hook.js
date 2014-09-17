Morris.Line.prototype.onGridClick = function(x, y) {
  var index;
  index = this.hitTest(x);
  return this.clickCallForRow(index);
};

Morris.Line.prototype.clickCallForRow = function(index) {
  var content, j, row, y, _i, _len, _ref;
  row = this.data[index];
  console.log(row);
  if (typeof this.options.clickCallback === 'function') {
    this.options.clickCallback(index, this.options, row.src);
  }
  return true;
};

Morris.Bar.prototype.onGridClick = function(x, y) {
  var index;
  index = this.hitTest(x);
  return this.clickCallForRow(index);
};

Morris.Bar.prototype.clickCallForRow = function(index) {
  var content, j, row, y, _i, _len, _ref;
  row = this.data[index];
  console.log(row);
  if (typeof this.options.clickCallback === 'function') {
    this.options.clickCallback(index, this.options, row.src);
  }
  return true;
};