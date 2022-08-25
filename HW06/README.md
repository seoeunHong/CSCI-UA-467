# Homework #06 - One Hand of Blackjack (Client Side JavaScript)

## Extra Credit

(5 points) Reset hand

10 points) Save results in database

## description

Create a two-player (user vs computer) client-side card game. The card game will be a single hand of blackjack. If you're unfamiliar with the rules:

<ol>
    <li>each player will try to construct a hand of cards that's equal to 21 or as close to 21 as possible, without going over
        <ol>
            <li>the sum of the numeric values of the cards determine the value of a hand</li>
            <li>face cards are worth 10</li>
            <li>aces are worth 1 or 11</li>
            <li>the player with the hand closest to (or equal to) 21 wins</li>
            <li>ties are possible</li>
        </ol>
    </li>
    <li>each player is dealt 2 cards from a 52 card deck, with each card representing some numeric value</li>   
    <li>in our version, the initial cards are dealt to the computer and user in an alternating fashion, with the computer being dealt the 1st card:
        <ol>
            <li>the computer is dealt one card, and the user is dealt another card</li>
            <li>this repeats one more time so that both the user and computer have 2 cards each</li>
        </ol>
    </li>
    <li>once the initial two cards are dealt, the user can choose to be dealt more cards ("hit") or stop being dealt cards ("stand")
        <ol>
            <li>if the user's hand ends up exceeding 21, then the user automatically loses</li>
            <li>if the user chooses to "stand" (to stop being dealt cards), then the computer can choose to continually "hit" or "stand"</li>
        </ol>
    </li>
    <li>once both players have either chosen to stand or have a hand with a total that's more than 21 ("bust"), the hands are compared
        <ol>
            <li>the player with the hand that's closest to 21 without going over wins</li>
            <li>again ties are possible (either same total, or both player "bust")</li>
        </ol>
    </li>
</ol>

## Authors

Seoeun Hong(:octocat:: [seoeunHong](https://github.com/seoeunHong))
