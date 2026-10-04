import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Location } from '../../Constants.js';

class KeenWarrior extends DrawCard {
    static id = 'keen-warrior';

    setupCardAbilities() {
        this.reaction('Draw 2 cards and return 1')
            .when({
                onCardRevealed: (event, context) =>
                    event.card.location === Location.Hand && event.card.controller === context.player.opponent,
                onLookAtCards: (event, context) =>
                    event.stateBeforeResolution.some((a) => a.location === Location.Hand && a.card.controller === context.player.opponent)
            })
            .gameAction(AbilityDsl.actions.sequential([
                AbilityDsl.actions.draw(context => ({ target: context.player, amount: 2 })),
                AbilityDsl.actions.chosenReturnToDeck(context => ({
                    target: context.player,
                    targets: false,
                    shuffle: false,
                    bottom: true,
                    amount: 1
                }))
            ]))
            .effect('draw 2 cards, then place a card on the bottom of their deck')
            .collectiveTrigger();
    }
}


export default KeenWarrior;
