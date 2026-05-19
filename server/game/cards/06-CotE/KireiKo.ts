import DrawCard from '../../drawcard.js';
import { CardTypes } from '../../Constants.js';

class KireiKo extends DrawCard {
    static id = 'kirei-ko';

    setupCardAbilities(ability) {
        this.reaction({
            title: 'Bow a character who triggered an ability',
            when: {
                onCardAbilityInitiated: (event, context) =>
                    event.card.type === CardTypes.Character && event.card.controller === context.player.opponent &&
                    event.ability.isTriggeredAbility()
            },
            cannotBeMirrored: true,
            gameAction: ability.actions.bow(context => ({ target: context.event.card }))
        });
    }
}


export default KireiKo;
