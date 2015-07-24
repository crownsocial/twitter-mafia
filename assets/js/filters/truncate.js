TwitterMafia.filter('truncate', function() {
  return function(input, length) {
    if (input.length > length) {
      return input.substr(0, length-3)+'...'
    }else {
      return input
    }
  }
})