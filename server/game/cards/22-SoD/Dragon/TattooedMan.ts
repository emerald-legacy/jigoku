import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class TattooedMan extends DrawCard {
    static id = 'tattooed-man';

    setupCardAbilities() {
        this.reaction({
            when: {
                onMoveFate: (event, context) =>
                    event.fate > 0 &&
                    event.recipient?.type === 'ring' &&
                    !!event.context &&
                    context.player === event.context.player &&
                    event.context.ability.isCardAbility()
            },
            title: 'Ready this character',
            gameAction: AbilityDsl.actions.ready(context => ({ target: context.source }))
        });
    }
}
