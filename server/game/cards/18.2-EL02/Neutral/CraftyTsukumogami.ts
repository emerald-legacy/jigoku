import type { AbilityContext } from '../../../AbilityContext.js';
import type BaseCard from '../../../BaseCard.js';
import DrawCard from '../../../DrawCard.js';
import type Ring from '../../../Ring.js';
import { TargetMode, CardType, AbilityType, Duration, EventName } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import { GameModes } from '../../../../GameModes.js';
import type { EventPayload } from '../../../Events/EventPayloads.js';

class CraftyTsukumogami extends DrawCard {
    static id = 'crafty-tsukumogami';

    setupCardAbilities() {
        this.action({
            title: 'Attach to a ring',
            target: {
                mode: TargetMode.Ring,
                activePromptTitle: 'Choose a ring to attach to',
                ringCondition: (ring: Ring, context?: AbilityContext) => !!context && this.checkRingCondition(ring, context),
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.cardLastingEffect(context => ({
                        canChangeZoneOnce: true,
                        duration: Duration.Custom,
                        target: context.source,
                        effect: [
                            AbilityDsl.effects.changeType(CardType.Attachment),
                            AbilityDsl.effects.gainAbility(AbilityType.ForcedReaction, {
                                title: 'Discard a card',
                                limit: AbilityDsl.limit.unlimitedPerConflict(),
                                when: {
                                    onConflictDeclared: (event: EventPayload<typeof EventName.OnConflictDeclared>, context: AbilityContext) => !!context.source.parent && context.source.parent === event.ring
                                },
                                printedAbility: false,
                                gameAction: AbilityDsl.actions.chosenDiscard((context: AbilityContext) => ({
                                    target: context.game.currentConflict?.attackingPlayer,
                                    amount: 1
                                }))
                            })
                        ]
                    })),
                    AbilityDsl.actions.attachToRing(context => ({
                        attachment: context.source
                    })),
                    AbilityDsl.actions.handler({
                        handler: context => {
                            const card = context.source;
                            card.controller.cardsInPlay.splice(card.controller.cardsInPlay.indexOf(card), 1);
                            if(context.game.isDuringConflict() && context.game.currentConflict) {
                                context.game.currentConflict.removeFromConflict(card);
                            }
                        }
                    })
                ])
            },
            effect: 'attach itself to the {0}'
        });
    }

    checkRingCondition(ring: Ring, context: AbilityContext) {
        const frameworkLimitsAttachmentsWithRepeatedNames = context.game.gameMode === GameModes.Emerald || context.game.gameMode === GameModes.Obsidian;
        if(frameworkLimitsAttachmentsWithRepeatedNames) {
            const attachment = context.source;
            if(ring.attachments.filter((a: DrawCard) => !a.allowDuplicatesOfAttachment).some((a: BaseCard) => a.id === attachment.id && a.controller === attachment.controller && a !== attachment)) {
                return false;
            }
        }
        return true;
    }

    canAttach(ring: Ring) {
        return ring && ring.type === 'ring' && this.getType() === CardType.Attachment;
    }
    canPlayOn(source: BaseCard) {
        return source && source.getType() === 'ring' && this.getType() === CardType.Attachment;
    }
    mustAttachToRing() {
        return this.getType() === CardType.Attachment;
    }
}

export default CraftyTsukumogami;
