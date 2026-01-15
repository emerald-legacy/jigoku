import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class TattooedMan extends DrawCard {
    static id = 'tattooed-man';

    setupCardAbilities() {
        this.reaction({
            when: {
                onMoveFate: (event, context) => event.fate > 0 && event.recipient.type === 'ring' && context.player === event.context.player && event.context.ability.isCardAbility()
            },
            title: 'Ready this character',
            gameAction: AbilityDsl.actions.ready(context => ({ target: context.source }))
        });
    }
}
