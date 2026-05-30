import { CharacterStatus } from '../../../Constants.js';
import type { TriggeredAbilityContext } from '../../../TriggeredAbilityContext.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class StandYourGround extends DrawCard {
    static id = 'stand-your-ground';

    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Prevent a character from leaving play',
            when: {
                onCardLeavesPlay: (event, context) => event.card.controller === context.player && event.card.isHonored
            },
            effect: 'prevent {1} from leaving play',
            effectArgs: (context) => context.event.card ?? '',
            cannotBeMirrored: true,
            gameAction: AbilityDsl.actions.cancel((context) => ({
                replacementGameAction: AbilityDsl.actions.discardStatusToken({
                    target: ((context as TriggeredAbilityContext).event.card as DrawCard)?.getStatusToken(CharacterStatus.Honored)
                })
            }))
        });
    }
}
