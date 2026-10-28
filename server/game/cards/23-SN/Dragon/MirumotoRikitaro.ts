import { CardType, Trait } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { reduceNextPlayedCardCost, modifyMilitarySkill } from '../../../effects.js';
import { discardFromPlay } from '../../../GameActions/GameActions.js';
import { msg } from '../../../GameChat.js';
import { isReducibleAttachmentPlay } from '../../attachmentPlay.js';

export default class MirumotoRikitaro extends DrawCard {
    static id = 'mirumoto-rikitaro';

    override setupCardAbilities() {
        this.interrupt('Reduce cost of next attachment')
            .when({
                onAbilityResolverInitiated: (event, context) =>
                    isReducibleAttachmentPlay(event.context) &&
                    !context.source.attachments.some((attachment) => attachment.controller === context.player) &&
                    event.context.player === context.player &&
                    event.context.target === context.source
            })
            .playerLastingEffect((context) => ({
                effect: reduceNextPlayedCardCost(
                    1,
                    (card) => card === context.event.context?.source
                )
            }))
            .chatText('reduce the cost of their next attachment by 1');

        this.conflictAction('Discard an attachment')
            .target({
                cardCondition: (card, context) => !!(card.hasSomeTrait(Trait.Item, Trait.Weapon, Trait.Armor) && card.parentCharacter && context.player.opponent && card.parentCharacter.isParticipatingFor(context.player.opponent)),
                cardType: CardType.Attachment
            }, discardFromPlay())
            .afterwardsIf((context) => context.target.hasTrait(Trait.Weapon))
            .cardLastingEffect({ effect: modifyMilitarySkill(2) })
            .message((context) => msg`${context.source} gains +2${'military'} due to discarding a weapon`);
    }
}
