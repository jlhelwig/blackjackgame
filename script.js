$(document).ready(function() {
    // console.log( "ready!" );

    var cardObj = {}
    var theDeck
    var cardCalled
    var cardImage
    var usedCard = false
    //This gets a deck I.D. we will use the same deck I.D. until the deck is down to 8 cards or so...
    $.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1').done(function(deck) {
        var theDeck = deck.deck_id
        // console.log(theDeck)
        cardDraw(theDeck)
    });

    function cardDraw(theDeck) {
        $.get('https://deckofcardsapi.com/api/deck/' + theDeck + '/draw/?count=52').done(function(card) {
          // console.log('asdfa', card);
            // console.log(card)
            var didItWork = card.success
            // console.log(didItWork)
            // for each(theDeck){
            //     for each (var item in obj) {
            //   sum += item;
            // }

            var deck = []
            for (let i = 0; i < 52; i++) {
                if (card.cards[i].value === "ACE") {
                    card.cards[i].value = '11'
                    cardCalled = card.cards[i].value
                }
                if (card.cards[i].value === "KING" || card.cards[i].value === "QUEEN" || card.cards[i].value === "JACK") {
                    card.cards[i].value = '10';
                    cardCalled = card.cards[i].value
                } else {
                    cardCalled = card.cards[i].value
                }
                var cardImage = card.cards[i].image
                // console.log(cardCalled)
                // console.log(cardImage)
                // console.log(usedCard)
                cardObj['cardCalled'] = cardCalled;
                cardObj['cardImage'] = cardImage;
                card.cards[i].usedCard = usedCard;
                // console.log(cardObj)
                deck.push(card.cards[i])
                // console.log(deck)
            }
                console.log(deck)

console.log(deck[0].value)
        });
    }

    // console.log(cardImage)
    //This will draw a card and show it (should be a reusable function for every time a card is drawn)





});
