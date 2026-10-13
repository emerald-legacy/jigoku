import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { CardType, RestrictionType, RestrictionScope } from '../../Constants.js';
import { cardCannot, modifyGlory } from '../../effects.js';
import { cardLastingEffect, multiple } from '../../GameActions/GameActions.js';
import { controlsShugenja } from '../controlsShugenja.js';

class CloakOfNight extends DrawCard {
    static id = 'cloak-of-night';

    setupCardAbilities() {
        this.action('Give a participating character +3 glory')
            .playOnlyIf((context) => controlsShugenja(context.player))
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating()
            }, multiple([
                cardLastingEffect(() => ({
                    effect: modifyGlory(3)
                })),
                cardLastingEffect((context) => ({
                    effect: cardCannot({
                        cannot: RestrictionType.Target,
                        appliesTo: RestrictionScope.OpponentsCardAbilities,
                        applyingPlayer: context.player
                    })
                }))
            ]))
            .chatText((context) => msg`give ${context.chatTarget()} +3 glory and prevent them from being chosen as the target of ${context.player.opponent}'s card abilities until the end of the conflict`);
    }
}

export default CloakOfNight;
