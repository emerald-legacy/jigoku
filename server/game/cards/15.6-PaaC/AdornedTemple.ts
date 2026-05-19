import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class AdornedTemple extends DrawCard {
    static id = 'adorned-temple';

    setupCardAbilities() {
        this.reaction({
            title: 'Draw cards',
            when: {
                onMoveFate: (event, context) => {
                    return (
                        event.fate > 0 &&
                        event.recipient &&
                        event.recipient.controller === context.player &&
                        event.context.ability.isCardAbility()
                    );
                }
            },
            effect: 'draw {1} card{2}',
            effectArgs: (context) => (context.event.recipient.isOrdinary() ? ['2', 's'] : ['a', '']),
            gameAction: AbilityDsl.actions.draw((context) => ({
                target: context.player,
                amount: context.event.recipient.isOrdinary() ? 2 : 1
            }))
        });
    }
}


export default AdornedTemple;
