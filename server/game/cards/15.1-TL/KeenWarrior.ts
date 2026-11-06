import DrawCard from '../../DrawCard.js';
import { chosenReturnToDeck } from '../../GameActions/GameActions.js';
import { Location } from '../../Constants.js';

class KeenWarrior extends DrawCard {
    static id = 'keen-warrior';

    override setupCardAbilities() {
        this.reaction('Draw 2 cards and return 1')
            .when({
                onCardRevealed: (event, context) =>
                    event.card.location === Location.Hand && event.card.controller === context.player.opponent,
                onLookAtCards: (event, context) =>
                    event.stateBeforeResolution.some((a) => a.location === Location.Hand && a.card.controller === context.player.opponent)
            })
            .collectiveTrigger()
            .draw(2)
            .chatText('draw 2 cards, then place a card on the bottom of their deck')
            .then()
            .gameAction(chosenReturnToDeck((context) => ({
                target: context.player,
                targets: false,
                shuffle: false,
                bottom: true
            })));
    }
}


export default KeenWarrior;
