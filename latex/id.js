// Kommandos dürfen scheinbar keine Zahlen enthalten, daher hier eine Umstellung auf Zeichen
module.exports = function(i) {
  var replacement = ["a","b","c","d","e","f","g","h","i","j"];
  var digits = (""+i).split("");
  for(let i=0; i<digits.length; i++) {
    digits[i] = replacement[digits[i]];
  }
  return digits.join("");
};
