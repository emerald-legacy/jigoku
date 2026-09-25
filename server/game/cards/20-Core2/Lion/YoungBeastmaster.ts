import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

function bonusSize(cards?: Array<DrawCard>) {
    if(!cards) {
        return 0;
    }

    let higherCost = 0;
    for(const card of cards) {
        const cardCost = card.getCost() ?? 0;
        if(cardCost > higherCost) {
            higherCost = cardCost;
        }
    }

    return higherCost;
}

export default class YoungBeastmaster extends DrawCard {
    static id = 'young-beastmaster';

    setupCardAbilities() {
        this.reaction('Gain a +X/+0 bonus')
            .when({
                onConflictDeclared: (event, context) => event.attackers?.includes(context.source) ?? false
            })
            .cost(AbilityDsl.costs.discardCardSpecific((context) => context.player.dynastyDeck.slice(0, 2)))
            .gameAction(AbilityDsl.actions.cardLastingEffect((context) => ({
                effect: AbilityDsl.effects.modifyMilitarySkill(bonusSize(context.costs.discardCard as DrawCard[]))
            })))
            .effect('give {0} +{1}{2}', (context) => [bonusSize(context.costs.discardCard as DrawCard[]), 'military']);
    }
}
