import type { AbilityContext } from '../../../AbilityContext.js';
import type BaseCard from '../../../BaseCard.js';
import DrawCard from '../../../DrawCard.js';
import type Ring from '../../../Ring.js';
import { CardType, AbilityType, Duration } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import { GameModes } from '../../../../GameModes.js';

class CraftyTsukumogami extends DrawCard {
    static id = 'crafty-tsukumogami';

    setupCardAbilities() {
        this.action('Attach to a ring')
            .ringTarget('target', {
                activePromptTitle: 'Choose a ring to attach to',
                ringCondition: (ring, context) => this.checkRingCondition(ring, context)
            }, AbilityDsl.actions.sequential([
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
                                onConflictDeclared: (event, context) => !!context.source.parent && context.source.parent === event.ring
                            },
                            printedAbility: false,
                            gameAction: AbilityDsl.actions.chosenDiscard((context) => ({
                                target: context.game.currentConflict?.attackingPlayer,
                                amount: 1
                            }))
                        })
                    ]
                })),
                AbilityDsl.actions.attachToRing((context) => ({
                    attachment: context.source
                })),
                AbilityDsl.actions.handler({
                    handler: context => {
                        const card = context.source;
                        if(!card.isDrawCard()) {
                            return;
                        }
                        card.controller.cardsInPlay.splice(card.controller.cardsInPlay.indexOf(card), 1);
                        if(context.game.isDuringConflict() && context.game.currentConflict) {
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

    canAttach(ring: Ring) {
        return ring && ring.type === 'ring' && this.getType() === CardType.Attachment;
    }
    canPlayOn(source: BaseCard) {
        return source && source.isRing() && this.getType() === CardType.Attachment;
    }
    mustAttachToRing() {
        return this.getType() === CardType.Attachment;
    }
}

export default CraftyTsukumogami;
