import BaseCard from '../../BaseCard.js';
import DrawCard from '../../DrawCard.js';

class AdornedTemple extends DrawCard {
    static id = 'adorned-temple';

    setupCardAbilities() {
        this.reaction('Draw cards')
            .when({
                onMoveFate: (event, context) => {
                    return (
                        (event.fate ?? 0) > 0 &&
                        event.recipient instanceof BaseCard &&
                        event.recipient.controller === context.player &&
                        event.context?.ability.isCardAbility()
                    );
                }
            })
            .draw((context) => ({
                amount: context.event.recipient instanceof BaseCard && context.event.recipient.isOrdinary() ? 2 : 1
            }))
            .effect('draw {1} card{2}', (context) => (context.event.recipient instanceof BaseCard && context.event.recipient.isOrdinary() ? ['2', 's'] : ['a', '']));
    }
}


export default AdornedTemple;
