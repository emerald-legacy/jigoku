import { bow } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';

class KireiKo extends DrawCard {
    static id = 'kirei-ko';

    setupCardAbilities() {
        this.reaction('Bow a character who triggered an ability')
            .when({
                onCardAbilityInitiated: (event, context) =>
                    event.card.type === CardType.Character && event.card.controller === context.player.opponent &&
                    event.ability.isTriggeredAbility()
            })
            .gameAction(bow((context) => ({ target: context.event.card })))
            .cannotBeMirrored();
    }
}


export default KireiKo;
