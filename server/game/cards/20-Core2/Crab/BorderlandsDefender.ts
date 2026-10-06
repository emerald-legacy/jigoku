import { cardCannot } from '../../../effects.js';
import DrawCard from '../../../DrawCard.js';

export default class BorderlandsDefender extends DrawCard {
    static id = 'borderlands-defender';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isDefending(),
            effect: [
                cardCannot({
                    cannot: 'sendHome',
                    restricts: 'opponentsCardEffects'
                }),
                cardCannot({
                    cannot: 'bow',
                    restricts: 'opponentsCardEffects'
                })
            ]
        });
    }
}
