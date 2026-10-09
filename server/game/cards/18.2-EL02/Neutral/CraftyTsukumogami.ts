import type { AbilityContext } from '../../../AbilityContext.js';
import { RingAttachment } from '../../RingAttachment.js';
import type Ring from '../../../Ring.js';
import { CardType, Duration } from '../../../Constants.js';
import { unlimitedPerConflict } from '../../../AbilityLimit.js';
import { changeType, gainAbility } from '../../../effects.js';
import {
    attachToRing,
    cardLastingEffect,
    chosenDiscard,
    handler,
    sequential
} from '../../../GameActions/GameActions.js';

class CraftyTsukumogami extends RingAttachment {
    static id = 'crafty-tsukumogami';

    setupCardAbilities() {
        this.action('Attach to a ring')
            .ringTarget({
                activePromptTitle: 'Choose a ring to attach to',
                ringCondition: (ring, context) => this.checkRingCondition(ring, context)
            }, sequential([
                cardLastingEffect((context) => ({
                    canChangeZoneOnce: true,
                    duration: Duration.Custom,
                    target: context.source,
                    effect: [
                        changeType(CardType.Attachment),
                        gainAbility.forcedReaction('Discard a card', {
                            onConflictDeclared: (event, context) => !!context.source.parent && context.source.parent === event.ring
                        }, (ability) => ability
                            .gameAction(chosenDiscard((context) => ({
                                target: context.game.currentConflict?.attackingPlayer
                            })))
                            .limit(unlimitedPerConflict()))
                    ]
                })),
                attachToRing((context) => ({
                    attachment: context.source
                })),
                handler({
                    handler: (context) => {
                        // attachToRing already took it out of the cards in play
                        if(context.game.currentConflict) {
                            context.game.currentConflict.removeFromConflict(context.source);
                        }
                    }
                })
            ]))
            .chatText('attach itself to the {0}');
    }

    private checkRingCondition(ring: Ring, context: AbilityContext) {
        const frameworkLimitsAttachmentsWithRepeatedNames = context.game.rules.attachmentsMaxOneCopyPerName;
        if(frameworkLimitsAttachmentsWithRepeatedNames) {
            const attachment = context.source;
            if(ring.attachments.filter((a) => !a.allowDuplicatesOfAttachment).some((a) => a.id === attachment.id && a.controller === attachment.controller && a !== attachment)) {
                return false;
            }
        }
        return true;
    }
}

export default CraftyTsukumogami;
