import { CardType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { PlayAttachmentAction } from '../../../PlayAttachmentAction.js';
import { reduceNextPlayedCardCost, modifyMilitarySkill } from '../../../effects.js';
import { discardFromPlay } from '../../../GameActions/GameActions.js';
import { msg } from '../../../GameChat.js';

export default class MirumotoRikitaro extends DrawCard {
    static id = 'mirumoto-rikitaro';

    setupCardAbilities() {
        this.interrupt('Reduce cost of next attachment')
            .when({
                onAbilityResolverInitiated: (event, context) => {
                    if(event.context === undefined) {
                        return false;
                    }
                    const ec = event.context;
                    const isAttachment =
                        ec.source.type === CardType.Attachment ||
                        ec.ability instanceof PlayAttachmentAction;
                    const sourceHasNoAttachment = context.source.attachments.filter(a => a.controller === context.player).length === 0;
                    return (
                        isAttachment &&
                        sourceHasNoAttachment &&
                        ec.player === context.player &&
                        ec.target === context.source &&
                        ec.ability.getReducedCost(ec) > 0
                    );
                }
            })
            .playerLastingEffect((context) => ({
                targetController: context.player,
                effect: reduceNextPlayedCardCost(
                    1,
                    (card) => card === context.event.context?.source
                )
            }))
            .effect('reduce the cost of their next attachment by 1');

        this.conflictAction('Discard an attachment')
            .target({
                cardCondition: (card, context) => !!(card.hasSomeTrait('item', 'weapon', 'armor') && card.parentCharacter && context.player.opponent && card.parentCharacter.isParticipatingFor(context.player.opponent)),
                cardType: CardType.Attachment
            }, discardFromPlay())
            .afterwardsIf((context) => context.target.hasTrait('weapon'))
            .cardLastingEffect({ effect: modifyMilitarySkill(2) })
            .message((context) => msg`${context.source} gains +2${'military'} due to discarding a weapon`);
    }
}
