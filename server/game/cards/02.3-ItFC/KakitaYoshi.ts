import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../drawcard.js';
import { CardTypes } from '../../Constants.js';

class KakitaYoshi extends DrawCard {
    static id = 'kakita-yoshi';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Draw 3 cards',
            condition: context => context.source.isParticipating(),
            cost: ability.costs.discardImperialFavor(),
            effect: 'draw 3 cards, and reduce the cost of events this conflict',
            gameAction: [
                ability.actions.draw({ amount: 3 }),
                ability.actions.playerLastingEffect((context: any) => ({
                    targetController: context.player,
                    effect: ability.effects.reduceCost({
                        amount: 2,
                        match: (card: DrawCard) => card.type === CardTypes.Event
                    })
                }))
            ]
        });
    }
}


export default KakitaYoshi;
