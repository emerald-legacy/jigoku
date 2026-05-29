import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class BorderlandsDefender extends DrawCard {
    static id = 'borderlands-defender';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isDefending(),
            effect: [
                AbilityDsl.effects.cardCannot({
                    cannot: 'sendHome',
                    restricts: 'opponentsCardEffects'
                }),
                AbilityDsl.effects.cardCannot({
                    cannot: 'bow',
                    restricts: 'opponentsCardEffects'
                })
            ]
        });
    }
}
