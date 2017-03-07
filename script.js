$(document).ready(function() {
    // console.log( "ready!" );

    var cardObj = {};
    var theDeck
    var cardCalled
    var cardImage
    var usedCard = false;
    //This gets a deck I.D. we will use the same deck I.D. until the deck is down to 8 cards or so...
    $.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1').done(function(deck) {
        var theDeck = deck.deck_id
        // console.log(theDeck)
        cardDraw(theDeck)
    });
    //draws 52 Random cards from above deck
    function cardDraw(theDeck) {
        $.get('https://deckofcardsapi.com/api/deck/' + theDeck + '/draw/?count=52').done(function(card) {

            var deck = createProperDeck(card)

            //shows deck array of card objects
            console.log(deck)
            //shows deck at i
            console.log(deck[0])
            //gives site of image
            //listen for bet to deal
          var bank = 1000;
                    $('.one').click(function(){
                      deal(deck)
                      bank=bank-1
                      console.log(bank)
                    })
              //listen for bet of 5 to deal
                    $('.five').click(function(){
                      deal(deck)
                      bank=bank-5
                      console.log(bank)
                    })

          console.log(bank)

        });
    }


    function createProperDeck(card) {
      var deck = []
      for (let i = 0; i < 52; i++) {
          //gives value to aces
          if (card.cards[i].value === "ACE") {
              card.cards[i].value = '11'
          }
          //gives value to kings, queens and jacks
          if (card.cards[i].value === "KING" || card.cards[i].value === "QUEEN" || card.cards[i].value === "JACK") {
              card.cards[i].value = '10';
          }
          //adds a usedCard class set to false
          card.cards[i].usedCard = usedCard;
          //pushes each card into the 'deck'
          deck.push(card.cards[i])
      }

      return deck;
    }


    function deal(newDeck) {
        for (let i = 0; i < 4; i++) {
            // console.log(deck[i].image)
            var cardPic = newDeck[i].image
            if (i===0){
            $('.dealer').append(`<img src =${cardPic}>`)
          }
          else if(i===1){
            $('.down').append(`<img src =${cardPic}>`)
          }
          else{
            $('.player').append(`<img src =${cardPic}>`)
          }
        }
    };


});
