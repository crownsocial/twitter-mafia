document.addEventListener("DOMContentLoaded", function() {
  /* D3  */

  var width = 320;
  var height = 280;

  var typeFace = 'Montserrat';
  var minFontSize = 12;
  var colors = d3.scale.category20b();

  var svg = d3.select('#word-cloud').append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate('+width/2+', '+height/2+')');

  var calculateCloud = function(wordCount) {
    d3.layout.cloud()
      .size([width, height])
      .words(wordCount)
      .rotate(function() { return ~~(Math.random()*2) * 90;}) // 0 or 90deg
      .font(typeFace)
      .fontSize(function(d) { return d.size * minFontSize; })
      .on('end', drawCloud)
      .start();
  }

  var drawCloud = function(words) {
    var vis = svg.selectAll('text').data(words);

    vis.enter().append('text')
      .style('font-size', function(d) { return d.size + 'px'; })
      .style('font-family', function(d) { return d.font; })
      .style('fill', function(d, i) { return colors(i); })
      .attr('text-anchor', 'middle')
      .attr('transform', function(d) {
        return 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')';
      })
      .text(function(d) { return d.text; });
  }

  /* convert the raw data into a proper form of key/value obj to pass to d3.layout.cloud
     it should return [{text: 'str', size: n},...]
  */
  var processData = function(strings) {
    if(!strings) return;

    // convert the array to a long string
    strings = strings.join(' ');

    // strip stringified objects and punctuations from the string
    strings = strings.toLowerCase().replace(/object Object/g, '').replace(/[\+\.,\/#!$%\^&\*{}=_`~]/g,'');

    // convert the str back in an array
    strings = strings.split(' ');

    // Count frequency of word occurance
    var wordCount = {};

    for(var i = 0; i < strings.length; i++) {
      if (!wordCount[strings[i]])
          wordCount[strings[i]] = 0;

      wordCount[strings[i]]++; // {'hi': 12, 'foo': 2 ...}
    }

    var wordCountArr = [];

    for(var prop in wordCount) {
      wordCountArr.push({text: prop, size: wordCount[prop]});
    }

    return wordCountArr;
  }

  var sampleWords = ["再见", "再见", "你好", "こんにちは", "こんにちは", "有人能看到吗", "有人能看到吗", "can you see this?", "Bonjour", "Bonjour", "Bonjour", "مرحبا", "من أنت", "PubNub is pretty cool, eh", "buenos días", "Hello", "anybody there", "yo", "anybody?", "hahaha", "hahaha", "hahaha", "this is so awesome", "LOLCAT", "LOL", "LOL", "LOL", "LOL", "LOL", "Hey", "Hey", "Hey", "Yo", "Yo", "Yo", "Yo", "Yo", "ciao", "ciao", "ciao", "ciao", "ciao", "hi", "hi", "hi", "hi", "hi", "i love cats", "california", "folsom@3rd", "folsom@3rd", "folsom@3rd", "folsom@3rd", "folsom@3rd", "pubnub", "pubnub", "pubnub", "pubnub", "moo", "hi", "Android", "wut?", "yo", "yo", "hey", "oi", "hey", "helloooooooooo", "lolcat", "d3js", "brb", "lmao", "anybody", "anybody there?", "where are you guys", "hello?", "hello?", "hi", "Yo", "bye", "hello", "hello", "Bennett"];

  calculateCloud(processData(sampleWords));
})