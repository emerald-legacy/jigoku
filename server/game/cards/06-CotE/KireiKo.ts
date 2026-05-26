import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../drawcard.js';
import { CardTypes } from '../../Constants.js';

class KireiKo extends DrawCard {
    static id = 'kirei-ko';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.reaction({
            title: 'Bow a character who triggered an ability',
            when: {
                onCardAbilityInitiated: (event: any, context: any) =>
                    event.card.type === CardTypes.Character && event.card.controller === context.player.opponent &&
                    event.ability.isTriggeredAbility()
            },
            cannotBeMirrored: true,
            gameAction: ability.actions.bow((context: any) => ({ target: context.event.card }))
        });
    }
}


export default KireiKo;
