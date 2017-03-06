$( document ).ready(function() {
    console.log( "ready!" );

var theDeck
var cardCalled
var cardImage
//This gets a deck I.D. we will use the same deck I.D. until the deck is down to 8 cards or so...
$.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1').done(function(deck){
  var theDeck = deck.deck_id
  console.log(theDeck)
  cardDraw(theDeck)
});
function cardDraw(theDeck){  $.get('https://deckofcardsapi.com/api/deck/' + theDeck + '/draw/?count=52').done(function(card) {
  console.log(card)
  var didItWork = card.success
  console.log(didItWork)
  // for each(theDeck){
//     for each (var item in obj) {
//   sum += item;
// }

  var cardCalled = card.cards[0].value
  var cardImage = card.cards[0].image
  // console.log(cardImage)
  // $(".card").(`<img =${cardImage}>`)
  // $(".pic").append("src=" +cardImage);
  // console.log(cardCalled)
  console.log(cardCalled)
  console.log(cardImage)

});
}

// console.log(cardImage)
//This will draw a card and show it (should be a reusable function for every time a card is drawn)





});
