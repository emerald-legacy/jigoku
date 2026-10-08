import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import { CardType } from '../../Constants.js';
import { cardCannot, modifyGlory } from '../../effects.js';
import { cardLastingEffect, multiple } from '../../GameActions/GameActions.js';
import { controlsShugenja } from '../controlsShugenja.js';

class CloakOfNight extends DrawCard {
    static id = 'cloak-of-night';

    setupCardAbilities() {
        this.action('Give a participating character +3 glory')
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating()
            }, multiple([
                cardLastingEffect(() => ({
                    effect: modifyGlory(3)
                })),
                cardLastingEffect((context) => ({
                    effect: cardCannot({
                        cannot: 'target',
                        restricts: 'opponentsCardAbilities',
                        applyingPlayer: context.player
                    })
                }))
            ]))
            .chatText('give {0} +3 glory and prevent them from being chosen as the target of {1}\'s triggered abilities until the end of the conflict', (context) => context.player.opponent ? [context.player.opponent] : []);
    }

    canPlay(context: AbilityContext, playType: string) {
        if(!controlsShugenja(context.player)) {
            return false;
        }

        return super.canPlay(context, playType);
    }
}

export default CloakOfNight;
