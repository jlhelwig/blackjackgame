$(document).ready(function() {
    // console.log( "ready!" );
    $('.double').hide();
    $('.split').hide();
    $('.hit').hide();
    $('.stick').hide();
    var cardObj = {};
    var theDeck;
    var cardCalled;
    var cardImage;
    var usedCard = false;
    var hitCard = 0;
    var playerHand;
    var dealerHand;
    var deck;
    var deckId;
    var checkSoft;

    var bank = 1000;
    //This gets a deck I.D. we will use the same deck I.D. until the deck is down to 8 cards or so...
    $.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1').done(function(deck) {
        deckId = deck.deck_id
        // console.log(theDeck)
        cardDraw(deckId);
    });
    //draws 52 Random cards from above deck
    function cardDraw(theDeck) {
        $.get('https://deckofcardsapi.com/api/deck/' + theDeck + '/draw/?count=52').done(function(rawCards) {

            deck = createProperDeck(rawCards);

            //shows deck array of card objects
            // console.log(deck);
            //shows deck at i
            // console.log(deck[0]);
            //gives site of image
            //listen for bet to deal
            $('.one').click(function() {
                playerHand = [];
                dealerHand = [];
                $('.hit').show();
                $('.stick').show();
                // clean house
                // console.log("right before hitCard>3 test =  " + hitCard)
                if (hitCard > 3) {
                    // console.log('this is running the clean up and splice')
                    var previousHit = hitCard;
                    $('.down').empty();
                    $('.dealer').empty();
                    $('.dealerDraw').empty();
                    $('.player').empty();
                    $('.split').hide();
                    $('.double').hide();
                    $('.alert').empty();
                    // $('span').empty();
                    // $('p').empty();
                    // $('.down').append("<img src = 'pics/card_back.png'>");
                    deck.splice(0, previousHit)
                    deal(deck);
                    bank -= 1;
                } else {
                    deal(deck);
                    bank -= 1;
                    // console.log(bank);
                }

            })
            //listen for bet of 5 to deal
            $('.five').click(function() {
                playerHand = [];
                dealerHand = [];
                $('.hit').show()
                $('.stick').show();
                // clean house
                if (hitCard > 3) {
                    // console.log('this is running the clean up and splice')
                    var previousHit = hitCard;
                    $('.down').empty();
                    $('.dealer').empty();
                    $('.dealerDraw').empty();
                    $('.player').empty();
                    $('.split').hide();
                    $('.double').hide();
                    $('.alert').empty();
                    // $('span').empty();
                    // $('p').empty();
                    // $('.down').append("<img src = 'pics/card_back.png'>");
                    deck.splice(0, previousHit)
                    deal(deck);
                    bank -= 5;
                } else {
                    deal(deck);
                    bank -= 5;
                }

            })
            // $('.test').click(function(){
            //   $("#card").flip();
            // })
            // console.log(bank);

        });
    }

    function createProperDeck(card) {
        var deck = [];
        for (let i = 0; i < 52; i++) {
            //gives value to aces
            if (card.cards[i].value === "ACE") {
                card.cards[i].value = '11';
            }
            //gives value to kings, queens and jacks
            if (card.cards[i].value === "KING" || card.cards[i].value === "QUEEN" || card.cards[i].value === "JACK") {
                card.cards[i].value = '10';
            }
            //adds a usedCard class set to false
            // card.cards[i].usedCard = usedCard;
            //pushes each card into the 'deck'
            deck.push(card.cards[i]);
        }

        return deck;
    }


    function deal(newDeck) {
        // $('#cover').append('<img id="cover" src=pics/card_back.png>')
        hitCard = 4
        for (let i = 0; i < 4; i++) {
            // console.log(deck[i].image)
            var cardPic = newDeck[i].image;
            // console.log('deck length' + newDeck.length)
            if (i === 0) {
                $('.dealer').append(`<img src =${cardPic}>`);
                dealerHand.push(parseInt(newDeck[i].value, 10));
                // console.log('this is where the picture of the dealer up hand should be' + cardPic)
            } else if (i === 1) {
                var cardBack = '<img class= "down" src="pics/card_back.png">';
                $('.down').append(`${cardBack}`);
                var downCardPic = '<img src =newDeck[i].image>';
                // $('.down').toggle().append(`<img src =${cardPic}>`)
                dealerHand.push(parseInt(newDeck[i].value, 10));
            } else if (i === 2 || i === 3) {
                $('.player').append(`<img src =${cardPic}>`);
                playerHand.push(parseInt(newDeck[i].value, 10));

            }
            // console.log("player hand " + playerHand);
            // console.log("dealer hand " + dealerHand);
            // console.log("hitcard or index# " + hitCard)
        }


        // let cardValThree = parseInt(newDeck[2].value, 10);
        // let cardValFour = parseInt(newDeck[3].value, 10);
        // var houseBlack = false;

        // console.log(cardValThree);
        // console.log(cardValFour);
        //
        if (dealerHand[0] + dealerHand[1] === 21) {
            // console.log('21');
            // console.log('Dealer BlackJack');
            $('.alert').empty();
            $('.alert').append('Dealer BlackJack');
            // alert("Dealer BlackJack!");
            let i = 1;
            let downCard = newDeck[i].image;
            // console.log('down card image = ' + downCard);
            // console.log('down card image source = ' + downCard)
            $('.down').empty();
            $('.dealer').append(`<img src =${downCard}>`);
            $('.hit').hide();
            $('.stick').hide();
            $('.double').hide();
            // var houseBlack= true
            //flip the down card
        }

        // if (playerHand[0] === playerHand[1] && playerHand[0]!== 10) {
        //   $('.split').show();
        //   console.log('Player has two of a kind')
        //   //make sure they can't split 10's
        //   console.log("player card 1 to check for pair = "+ playerHand[0]);
        //   console.log("player card 2 to check for pair = "+ playerHand[1]);
        //
        // }
        // console.log(playerHand[0]===playerHand[1])
        if (playerHand[0] + playerHand[1] === 21) {
            // console.log('player BlackJack');
            $('.alert').empty();
            $('.alert').append('BlackJack!! You Win!!');
            $('.hit').hide();
            $('.stick').hide();
            // alert("BlackJack!! You Win");

            // if (houseBlack) {
            //     console.log('PUSH');
            //     alert('push');
            //
            //     //return the bet to bank
            //     //escape from if statement?
            // }
            //add 1.5 times bet to bank
        }
        if (playerHand[0] + playerHand[1] === 21 && dealerHand[0] + dealerHand[1] === 21) {
            $('.alert').append('PUSH')
            $('.hit').hide();
            $('.stick').hide();
            //check for naturals blackjacks for both dealer and player

        }
        if (playerHand[0] + playerHand[1] === 11 && dealerHand[0] + dealerHand[1] !==21) {
            $('.double').show();
            $('.double').click(function() {
                // console.log("Double Down Time")
                $('.hit').hide();
                $('.stick').hide();
                $('.double').hide();
                hitMe(newDeck, playerHand);
                stick(newDeck, dealerHand);
            });
            //player gets one card and function stick is called
        }


    }; //above is for function newDeck

    $('.hit').click(function() {
        // console.log("playerHand var = " + playerHand);
        $('.double').hide();
        hitMe(deck, playerHand)
        // console.log("playerHand after hitMe function = " + playerHand);
        var sumOfCards = playerHand.reduce(function(acc, val) {
            return acc += val;
        }, 0)
        var checkAce = $.inArray(11, playerHand);
        if (sumOfCards > 21 && checkAce !== -1) {
          playerHand[checkAce]=1
          var sumOfCards = playerHand.reduce(function(acc, val) {
              return acc += val;
          }, 0)
        }
        // console.log(sumOfCards);
        $('.alert').empty();
        $('.alert').append(sumOfCards)
        // alert("you have " + sumOfCards);
        if (sumOfCards > 21) {
            // console.log('BUST!')
            $('.alert').empty();
            $('.alert').append("BUST")
            $('.hit').hide();
            $('.stick').hide();
            // alert('BUST!')
            // reduce the cards in the deck and re-deal or simply call new deck
        }
        // bank=bank-1
        // console.log(bank)
    });

    $('.stick').click(function() {
        // console.log("you clicked stick");
        stick(deck, dealerHand, playerHand);
        $('.hit').hide();
        $('.stick').hide();
        // var sumOfDealerCards = dealerHand.reduce(function(acc,val){
        //   return acc+=val
        // },0)
        // Alert("Dealer Has "+ sumOfDealerCards)
        // $('.down').append(downCardPic)
    })

    function stick(aDeck, dhand, phand) {
        let i = 1;
        let downCard = aDeck[i].image;
        // console.log('down card image = ' + downCard);
        $('.down').empty();

        $('.dealer').append(`<img src =${downCard}>`);
        let downCardVal = parseInt(aDeck[i].value, 10);
        var sumOfDealerCards = dhand.reduce(function(acc, val) {
            return acc += val;
        }, 0);
        $('.alert').empty();
        $('.alert').append('Dealer has ' + sumOfDealerCards);
        // alert("dealer has" + sumOfDealerCards);
        // need to check to see who won in this case
        while (sumOfDealerCards <= 16) {
            // console.log(sumOfDealerCards)
            sumOfDealerCards = dealerHit(aDeck, dhand)
            checkSoft = $.inArray(11, dhand)

            //draw a card function add to dealerHand sum and check again
        }

        if (sumOfDealerCards > 21 && checkSoft !== -1) {
            sumOfDealerCards = sumOfDealerCards - 10
        }
        sumOfPlayerCards = phand.reduce(function(acc, val) {
            return acc += val;
        }, 0)

        if (sumOfDealerCards > 21) {
            //need to check for soft numbers here
            $('.alert').empty();
            $('.alert').append('Dealer Busts! You Win!');
        } else if (sumOfDealerCards === sumOfPlayerCards) {
            $('.alert').empty();
            $('.alert').append('Push')

        } else if (sumOfDealerCards > sumOfPlayerCards) {
            $('.alert').empty();
            $('.alert').append('Dealer Wins!')


        }

        else if (sumOfDealerCards < sumOfPlayerCards) {
          console.log('dealer sum ' + sumOfDealerCards);
          console.log('player sum ' + sumOfPlayerCards);

            $('.alert').empty();
            $('.alert').append('Player Wins!')


        }
        // console.log('cards left in deck' + deck.length)
        if (deck.length < 20) {
            cardDraw(deckId)
            alert('shuffling!!!')
        }



    }


    function hitMe(aDeck, hand) {
        var cardPic = aDeck[hitCard].image;
        // console.log(cardPic);
        $('.player').append(`<img src =${cardPic}>`);

        let newCard = parseInt(aDeck[hitCard].value, 10);
        hand.push(newCard);
        hitCard = hitCard + 1;
        // console.log("index of next card = " + hitCard);
    }

    function dealerHit(aDeck, dhand) {
        var dealerHitPic = aDeck[hitCard].image;
        // console.log("dealer hit card = " + dealerHitPic);
        $('.dealer').append(`<img src =${dealerHitPic}>`);
        let newCard = parseInt(aDeck[hitCard].value, 10);
        dhand.push(newCard)
        hitCard = hitCard + 1
        // console.log('dealer hand is = ' + dhand)
        var sumOfDealerCards = dhand.reduce(function(acc, val) {
            return acc += val;
        }, 0);
        if (newCard === 11 && sumOfDealerCards > 21) {
            sumOfDealerCards = sumOfDealerCards - 10
        }
        $('.alert').empty();
        $('.alert').append('Dealer has ' + sumOfDealerCards)
        // alert("dealer has " + sumOfDealerCards)
        return sumOfDealerCards;
    }

    // function endHand(){
    //   if(sumOfCards>sumOfDealerCards){
    //     console.log('you win '+sumOfCards+' to '+sumOfDealerCards)
    //   }
    // }
    // function bust(){
    //   //will show either the player or the dealer win, depending on who busted
    // }
    // function winner(){
    //   //compares the sum of player hand and the sum of the dealer hand and determines winner
    //   //gives indication of who won
    // }

});
