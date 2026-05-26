import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../drawcard.js';

class ProvingGround extends DrawCard {
    static id = 'proving-ground';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.reaction({
            title: 'Draw a card after winning a duel',
            when: {
                afterDuel: (event: any, context: any) => {
                    if(!event.winner) {
                        return false;
                    }
                    if(Array.isArray(event.winner)) {
                        return event.winner.some((card: any) => card.controller === context.player);
                    }
                    return event.winner.controller === context.player;
                }
            },
            gameAction: ability.actions.draw(),
            limit: ability.limit.perRound(2)
        });
    }
}


export default ProvingGround;
