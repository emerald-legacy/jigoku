import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import type BaseCard from '../../BaseCard.js';
import { Location, Players, TargetMode } from '../../Constants.js';
import { flipDynasty } from '../../GameActions/GameActions.js';

class IkomaMessageRunner extends DrawCard {
    static id = 'ikoma-message-runner';

    override setupCardAbilities() {
        this.action('Flip a card faceup')
            // choosing nothing in both changes nothing, so there must be a card to turn faceup
            .condition((context) => context.game.allCards.some((card) =>
                card.isDynasty && card.isFacedown() && card.isInProvince() && flipDynasty().canAffect(card, context)))
            .targetCards({
                name: 'myCard',
                activePromptTitle: 'Choose a facedown card in your provinces',
                location: Location.Provinces,
                mode: TargetMode.UpTo,
                numCards: 1,
                optional: true,
                controller: Players.Self,
                cardCondition: (card) => card.isDynasty && card.isFacedown()
            }, flipDynasty())
            .targetCards({
                name: 'opponentsCard',
                activePromptTitle: 'Choose a facedown card in opponents provinces',
                location: Location.Provinces,
                controller: Players.Opponent,
                mode: TargetMode.UpTo,
                numCards: 1,
                optional: true,
                cardCondition: (card) => card.isDynasty && card.isFacedown()
            }, flipDynasty())
            .chatText((context) => msg`reveal up to 1 facedown card in each player's provinces${this.buildString(context.targets.myCard, context.targets.opponentsCard)}`);
    }

    buildString(myCards: BaseCard[] | undefined, opponentsCards: BaseCard[] | undefined) {
        let string = '';

        const myCard = myCards?.[0];
        if(myCard) {
            string = string.concat(`. ${myCard.name} is revealed in ${myCard.controller.name}'s ${myCard.location}`);
        }

        const opponentCard = opponentsCards?.[0];
        if(opponentCard) {
            string = string.concat(`. ${opponentCard.name} is revealed in ${opponentCard.controller.name}'s ${opponentCard.location}`);
        }
        return string;
    }
}


export default IkomaMessageRunner;
