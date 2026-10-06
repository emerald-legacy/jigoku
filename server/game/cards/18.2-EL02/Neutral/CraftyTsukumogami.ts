import type { AbilityContext } from '../../../AbilityContext.js';
import { RingAttachment } from '../../RingAttachment.js';
import type Ring from '../../../Ring.js';
import { CardType, AbilityType, Duration } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import { changeType, gainAbility } from '../../../effects.js';
import {
    attachToRing,
    cardLastingEffect,
    chosenDiscard,
    handler,
    sequential
} from '../../../GameActions/GameActions.js';
import { GameModes } from '../../../../GameModes.js';

class CraftyTsukumogami extends RingAttachment {
    static id = 'crafty-tsukumogami';

    setupCardAbilities() {
        this.action('Attach to a ring')
            .ringTarget({
                activePromptTitle: 'Choose a ring to attach to',
                ringCondition: (ring, context) => this.checkRingCondition(ring, context)
            }, sequential([
                cardLastingEffect(context => ({
                    canChangeZoneOnce: true,
                    duration: Duration.Custom,
                    target: context.source,
                    effect: [
                        changeType(CardType.Attachment),
                        gainAbility(AbilityType.ForcedReaction, {
                            title: 'Discard a card',
                            limit: AbilityDsl.limit.unlimitedPerConflict(),
                            when: {
                                onConflictDeclared: (event, context) => !!context.source.parent && context.source.parent === event.ring
                            },
                            printedAbility: false,
                            gameAction: chosenDiscard((context) => ({
                                target: context.game.currentConflict?.attackingPlayer
                            }))
                        })
                    ]
                })),
                attachToRing((context) => ({
                    attachment: context.source
                })),
                handler({
                    handler: context => {
                        const card = context.source;
                        card.controller.cardsInPlay.splice(card.controller.cardsInPlay.indexOf(card), 1);
                        if(context.game.currentConflict) {
                            context.game.currentConflict.removeFromConflict(card);
                        }
                    }
                })
            ]))
            .effect('attach itself to the {0}');
    }

    private checkRingCondition(ring: Ring, context: AbilityContext) {
        const frameworkLimitsAttachmentsWithRepeatedNames = context.game.gameMode === GameModes.Emerald || context.game.gameMode === GameModes.Obsidian;
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
