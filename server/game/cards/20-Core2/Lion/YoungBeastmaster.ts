import * as costs from '../../../costs/index.js';
import { modifyMilitarySkill } from '../../../effects.js';
import DrawCard from '../../../DrawCard.js';

function bonusSize(cards: DrawCard[]) {
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
            .cost(costs.discardCardsOf((context) => context.player.dynastyDeck.slice(0, 2)))
            .cardLastingEffect((context) => ({
                effect: modifyMilitarySkill(bonusSize(context.costs.discardCard ?? []))
            }))
            .effect('give {0} +{1}{2}', (context) => [bonusSize(context.costs.discardCard ?? []), 'military']);
    }
}
