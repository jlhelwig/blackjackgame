$(document).ready(function() {
    $('.double').hide();
    $('.split').hide(); // Split button is initially hidden
    $('.hit').hide();
    $('.stick').hide();
    var cardObj = {};
    var theDeck;
    // var cardCalled; // Unused variable
    var cardImage;
    var hitCard = 0; // Index for the next card to draw from the deck array
    var playerHand;
    var dealerHand;
    var deck; // Array containing card objects
    var deckId; // The ID of the current deck from the API
    // var checkSoft; // Declared but not actively used in current logic, potentially for future Ace handling.

    var bank = 1000; // Initial bankroll
    var currentBet = 0; // To store the current bet for the round

    // Initialize deck ID and shuffle
    $.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1').done(function(deck) {
        deckId = deck.deck_id
        cardDraw(deckId);
    });

    // Draw 52 cards from the shuffled deck and set up betting listeners
    function cardDraw(theDeckId) { // Renamed parameter to be more specific
        $.get('https://deckofcardsapi.com/api/deck/' + theDeckId + '/draw/?count=52').done(function(rawCards) {
            deck = createProperDeck(rawCards);
            hitCard = 0; // Reset hitCard index when a new deck is drawn/prepared

            // Set up listeners for bets
            $('.one').off('click').on('click', function() {
                currentBet = 1;
                playRound(deck);
            });

            $('.five').off('click').on('click', function() {
                currentBet = 5;
                playRound(deck);
            });
        });
    }

    // Convert card data from API to a usable format
    function createProperDeck(cardData) { // Renamed parameter for clarity
        var deck = [];
        for (let i = 0; i < cardData.cards.length; i++) { // Use cardData.cards.length for safety
            let card = cardData.cards[i];
            let value = card.value;
            if (value === "ACE") {
                value = '11'; // Aces are initially 11
            } else if (value === "KING" || value === "QUEEN" || value === "JACK") {
                value = '10';
            }
            card.value = value; // Update the value in the card object
            deck.push(card);
        }
        return deck;
    }

    // Helper function to calculate hand value, handling Aces correctly
    function calculateHandValue(hand) {
        let sum = 0;
        let aceCount = 0;

        for (let i = 0; i < hand.length; i++) {
            const cardValue = parseInt(hand[i].value, 10); // Access 'value' property
            if (cardValue === 11) {
                aceCount++;
            }
            sum += cardValue;
        }

        // Adjust for Aces if sum is over 21
        while (sum > 21 && aceCount > 0) {
            sum -= 10; // Change Ace value from 11 to 1
            aceCount--;
        }
        return sum;
    }

    // Helper function to check if a split is possible
    function canSplit(hand) {
        if (hand.length !== 2) return false;
        // Check if the values of the two cards are the same rank
        return hand[0].value === hand[1].value;
    }

    // Function to start a new round of play
    function playRound(currentDeck) { // Renamed parameter for clarity
        playerHand = [];
        dealerHand = [];
        hitCard = 0; // Reset hitCard index to start drawing from the beginning of the deck for this round

        $('.hit').show();
        $('.stick').show();
        $('.double').hide();
        $('.split').hide(); // Split button is hidden by default until condition met

        // Clear previous round's elements
        $('.down').empty();
        $('.dealer').empty();
        $('.player').empty();
        $('.alert').empty();

        deal(currentDeck);
        bank -= currentBet; // Deduct bet from bank
        updateBankDisplay(); // Function to update bank display (needs to be added)
    }

    // Deals initial two cards to player and dealer
    function deal(deckToDeal) { // Renamed parameter for clarity
        for (let i = 0; i < 4; i++) { // Deal 4 cards total (2 to player, 2 to dealer)
            var card = deckToDeal[hitCard]; // Use hitCard to get the current card
            if (i === 0) { // Dealer's up card
                $('.dealer').append(`<img src ="${card.image}">`);
                dealerHand.push(card);
            } else if (i === 1) { // Dealer's down card
                var cardBack = '<img class="down" src="pics/card_back.png">';
                $('.down').append(`${cardBack}`);
                dealerHand.push(card);
            } else if (i === 2 || i === 3) { // Player's cards
                $('.player').append(`<img src ="${card.image}">`);
                playerHand.push(card);
            }
            hitCard++; // Increment index for the next card
        }

        // Check for immediate Blackjacks
        const playerHandValue = calculateHandValue(playerHand);
        const dealerHandValue = calculateHandValue(dealerHand);

        if (playerHandValue === 21 && dealerHandValue === 21) {
            revealDealerCard();
            $('.alert').empty().append('PUSH');
            endRound('push'); // Pass outcome directly
        } else if (playerHandValue === 21) {
            revealDealerCard();
            $('.alert').empty().append('BlackJack!! You Win!!');
            endRound('blackjack'); // Pass outcome directly
        } else if (dealerHandValue === 21) {
            revealDealerCard();
            $('.alert').empty().append('Dealer BlackJack');
            endRound('dealer_blackjack'); // Pass outcome directly
        }
        // Show Double Down option if applicable (player has 11 on first two cards)
        if (playerHandValue === 11 && dealerHandValue !== 21) { // Player can only double down on their first two cards
             $('.double').show();
             $('.double').click(function() {
                 handleDoubleDown();
             });
        }
        // Show Split button if player has two cards of the same rank
        if (canSplit(playerHand)) {
            $('.split').show();
            // NOTE: Full split game logic (managing two hands) is not yet implemented.
            // This only enables the button.
            // $('.split').click(function() { /* Implement split logic here */ });
        }
    };

    // Handles hitting for the player
    $('.hit').click(function() {
        $('.double').hide(); // Hide double down after player hits
        hitMe(deck, playerHand, '.player'); // Use deck and playerHand
        const currentHandValue = calculateHandValue(playerHand);
        $('.alert').empty().append(currentHandValue);
        if (currentHandValue > 21) {
            $('.alert').empty().append("BUST");
            endRound('player_bust');
        }
    });

    // Handles sticking for the player
    $('.stick').click(function() {
        $('.hit').hide();
        $('.stick').hide();
        $('.double').hide();
        stick(deck, dealerHand, playerHand);
    });

    // Handles doubling down
    function handleDoubleDown() {
        // Player hits one more card and then automatically sticks
        hitMe(deck, playerHand, '.player'); // Use deck and playerHand
        const playerHandValue = calculateHandValue(playerHand);
        $('.alert').empty().append(playerHandValue);
        if (playerHandValue > 21) {
             $('.alert').empty().append("BUST");
             endRound('player_bust');
        } else {
            stick(deck, dealerHand, playerHand); // Player automatically sticks after double down hit
        }
    }

    // Reveals the dealer's hidden card
    function revealDealerCard() {
        if (deck.length > 1 && hitCard < deck.length) { // Ensure card is available
             let hiddenCard = deck[1]; // Assuming deck[1] is the hidden card based on deal loop index
             $('.down').empty().append(`<img src ="${hiddenCard.image}">`);
        }
    }

    // Dealer hits to reach at least 17
    function dealerHit(aDeck, dhand) {
        if (hitCard >= aDeck.length) { // Safety check: If we somehow run out of cards
            console.error("Ran out of cards in the deck!");
            return calculateHandValue(dhand); // Return current value to avoid error
        }
        var card = aDeck[hitCard];
        $('.dealer').append(`<img src ="${card.image}">`);
        dhand.push(card);
        hitCard++; // Increment index for the next card
        var sumOfDealerCards = calculateHandValue(dhand);
        $('.alert').empty().append('Dealer has ' + sumOfDealerCards);
        return sumOfDealerCards;
    }

    // Logic when player chooses to stick
    function stick(aDeck, dhand, phand) {
        revealDealerCard(); // Reveal dealer's hidden card

        var sumOfDealerCards = calculateHandValue(dhand);
        $('.alert').empty().append('Dealer has ' + sumOfDealerCards);

        // Dealer hits until score is 17 or more
        while (sumOfDealerCards <= 16) {
            sumOfDealerCards = dealerHit(aDeck, dhand);
        }

        // Determine the outcome after dealer sticks or busts
        endRound(determineOutcome(calculateHandValue(phand), sumOfDealerCards));
    }

    // Determines the outcome of the round
    function determineOutcome(playerScore, dealerScore) {
        if (playerScore > 21) return 'player_bust';
        if (dealerScore > 21) return 'player_win'; // Dealer busts
        if (playerScore === dealerScore) return 'push';
        // Blackjack checks are now handled in deal() for initial hands
        if (playerScore > dealerScore) return 'player_win';
        if (dealerScore > playerScore) return 'dealer_win';
        return 'push'; // Default to push if somehow not covered
    }

    // Ends the round, updates bankroll, and resets for next round
    function endRound(outcome) {
        let payout = 0;
        let alertMessage = '';

        switch (outcome) {
            case 'player_win':
                payout = currentBet;
                alertMessage = ' You Win!';
                break;
            case 'blackjack':
                payout = currentBet * 1.5; // 3:2 payout
                alertMessage = ' Blackjack!';
                break;
            case 'dealer_win':
                payout = -currentBet;
                alertMessage = ' Dealer Wins!';
                break;
            case 'push':
                payout = 0; // Bet is returned
                alertMessage = ' Push!';
                break;
            case 'player_bust':
            case 'dealer_blackjack': // Assuming player didn't also have blackjack for this case
                payout = -currentBet;
                break;
        }

        bank += payout;
        updateBankDisplay(); // Update the displayed bankroll

        $('.alert').append(alertMessage);

        // Hide action buttons and show bet buttons for next round
        $('.hit').hide();
        $('.stick').hide();
        $('.double').hide();
        $('.split').hide(); // Hide split if not implemented

        // Prepare for next bet
        $('.one').show();
        $('.five').show();

        // Check if deck needs reshuffling for next round
        if (hitCard >= deck.length - 20) { // Check if fewer than 20 cards are left
            alert('Reshuffling deck...');
            // Reshuffle the current deck using the same deckId
            $.get('https://deckofcardsapi.com/api/deck/' + deckId + '/shuffle/').done(function(shuffleResponse) {
                if (shuffleResponse.success) {
                    hitCard = 0; // Reset index after successful shuffle
                } else {
                    console.error("Failed to reshuffle deck:", shuffleResponse);
                    // Handle failure: maybe fetch a new deck or alert user
                }
            });
        }
    }

    // Function to update the bankroll display on the page
    function updateBankDisplay() {
        // Example: If you have an HTML element like <span class="bank-display"></span>
        // $('.bank-display').text(`Bank: $${bank}`);
        console.log(`Current bank: $${bank}`); // Log to console if no display element
    }

    // Initial call to update bank display when page loads
    updateBankDisplay();
});
