$(document).ready(function() {
    // console.log( "ready!" );

    var cardObj = {};
    var theDeck
    var cardCalled
    var cardImage
    var usedCard = false;
    //This gets a deck I.D. we will use the same deck I.D. until the deck is down to 8 cards or so...
    $.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1').done(function(deck) {
        var deckId = deck.deck_id
        // console.log(theDeck)
        cardDraw(deckId)
    });
    //draws 52 Random cards from above deck
    function cardDraw(theDeck) {
        $.get('https://deckofcardsapi.com/api/deck/' + theDeck + '/draw/?count=52').done(function(rawCards) {

            var deck = createProperDeck(rawCards)

            //shows deck array of card objects
            console.log(deck);
            //shows deck at i
            console.log(deck[0]);
            //gives site of image
            //listen for bet to deal
            var bank = 1000;
            $('.one').click(function() {
                deal(deck);
                bank -= 1;
                console.log(bank);
            })
            //listen for bet of 5 to deal
            $('.five').click(function() {
                deal(deck)
                bank -= 5
                console.log(bank)
            })
            // $('.test').click(function(){
            //   $("#card").flip();
            // })
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
        // $('#cover').append('<img id="cover" src=pics/card_back.png>')
        var playerHand = [];
        var dealerHand = [];
        for (let i = 0; i < 4; i++) {
            // console.log(deck[i].image)
            var cardPic = newDeck[i].image
            if (i === 0) {
                $('.dealer').append(`<img src =${cardPic}>`)
                dealerHand.push(parseInt(newDeck[i].value, 10));
            } else if (i === 1) {
                var cardBack = '<img class="down" src="pics/card_back.png">'
                $('.down').append(`${cardBack}`)
                var downCardPic='<img src =newDeck[i].image>'
                // $('.down').toggle().append(`<img src =${cardPic}>`)
                dealerHand.push(parseInt(newDeck[i].value, 10));
            } else if (i === 2 || i === 3) {
                $('.player').append(`<img src =${cardPic}>`)
                playerHand.push(parseInt(newDeck[i].value, 10));

            }
            console.log(playerHand);
            console.log(dealerHand);
        }


        let cardValThree = parseInt(newDeck[2].value, 10);
        let cardValFour = parseInt(newDeck[3].value, 10)
        var houseBlack = false

        console.log(cardValThree)
        console.log(cardValFour)
        console.log(typeof cardValOne);

        if (dealerHand[0] + dealerHand[1] === 21) {
            console.log('21')
            console.log('Dealer BlackJack')
            alert("Dealer BlackJack!")
            // var houseBlack= true
            //flip the down card
        }

        if (playerHand[0] + playerHand[1] === 21) {
            console.log('player BlackJack')
            alert("BlackJack!! You Win")

            if (houseBlack) {
                console.log('PUSH')
                alert('push');

                //return the bet to bank
                //escape from if statement?
            }
            //add 1.5 times bet to bank
        }

        $('.hit').click(function() {
            console.log(playerHand);
            hitMe(newDeck, playerHand)
            console.log(playerHand);
            var sumOfCards = playerHand.reduce(function(acc, val) {
                return acc += val
            }, 0)
            var checkAce = $.inArray(11, playerHand)
            if (sumOfCards > 21 && checkAce !== -1) {
                sumOfCards = sumOfCards - 10
            }
            console.log(sumOfCards)
            alert("you have " + sumOfCards)
            // bank=bank-1
            // console.log(bank)
        });
        $('.stick').click(function(){
          console.log("you clicked stick")
          stick(newDeck,dealerHand)
          // var sumOfDealerCards = dealerHand.reduce(function(acc,val){
          //   return acc+=val
          // },0)
          // Alert("Dealer Has "+ sumOfDealerCards)
          // $('.down').append(downCardPic)
        })



    }; //above is for function newDeck

    function stick(aDeck,dealerHand) {
    let i = 1;
    let downCard = aDeck[i].image;
    // console.log('down card image = ' + downCard);
    $('.down').empty()
    $('.down').append(`<img src =${downCard}>`);
    let downCardVal = parseInt(aDeck[i].value, 10);
    var sumOfDealerCards = dealerHand.reduce(function(acc,val){
      return acc+=val
    },0)
    alert("dealer has"+sumOfDealerCards)

}


    function hitMe(aDeck, hand) {
        let i = 4;
        var cardPic = aDeck[i].image;
        console.log(cardPic);
        $('.player').append(`<img src =${cardPic}>`);

        let newCard = parseInt(aDeck[i].value, 10);
        hand.push(newCard);
        i = i + 1;
    }
    function bust(){
      //will show either the player or the dealer win, depending on who busted
    }
    function winner(){
      //compares the sum of player hand and the sum of the dealer hand and determines winner
      //gives indication of who won
    }

});
