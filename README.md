# blackjackgame
Heads up blackjack
https://wireframe.cc/Mq9Hnh


# Some things to Ponder:
What inputs does it need?
What outputs does it produce?
What web APIs will it use?
What technologies will it use?
What additional features will it have?

Inputs require two decisions. First, before any action a bet must be made. A bet of 1 units or 5 units will happen. 
The second decision is made after the player is given two face up cards, and the dealer is given a face up and a face down card.
The player then decides whether to stick or hold. Additional cards will be given until the player holds or he busts, busts automatically stops the hand. When hold is chosen the game is resolved by the normal rules of blackjack.
Special decisions for the player, double down on 11, split on any pair.

The Outputs are winning or losing, and whether or not to increase the bank (initialized at 300) or take the bet away or to push (a tie).

I would like to develop my own deck of cards, but in the meantime I will use the Deck of Cards API https://deckofcardsapi.com/ 

Technologies used, in addition to jQuery I will be using an external library to assist in animating (flipping cards). In addition I have found an open source vector playing card set. https://sourceforge.net/projects/vector-cards/files/

Additional features and stretch goals:
I would like to add insurance for authenticity (though it is rarely a good idea in real life use).
I would like to prompt people in best play based on strategy.
I would like to have a running count of high to low cards (each low card is given a +1, and each high card a -1) to determine optimal betting strategy.
