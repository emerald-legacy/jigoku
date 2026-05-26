import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../drawcard.js';

class SeppunTruthseeker extends DrawCard {
    static id = 'seppun-truthseeker';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.forcedInterrupt({
            title: 'Each player draws 2 cards',
            when: {
                onCardLeavesPlay: (event: any, context: any) => event.card === context.source
            },
            effect: 'make both players draw 2 cards',
            gameAction: ability.actions.draw((context: any) => ({
                target: context.game.getPlayers(),
                amount: 2
            }))
        });
    }
}


export default SeppunTruthseeker;
