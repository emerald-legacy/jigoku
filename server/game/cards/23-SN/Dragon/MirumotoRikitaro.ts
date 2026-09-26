import { CardType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { PlayAttachmentAction } from '../../../PlayAttachmentAction.js';
import AbilityDsl from '../../../abilitydsl.js';

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
                        ec.target &&
                        ec.target.controller === context.player &&
                        ec.target === context.source &&
                        ec.ability.getReducedCost(ec) > 0
                    );
                }
            })
            .gameAction(AbilityDsl.actions.playerLastingEffect((context) => ({
                targetController: context.player,
                effect: AbilityDsl.effects.reduceNextPlayedCardCost(
                    1,
                    (card: DrawCard) => card === context.event.context?.source
                )
            })))
            .effect('reduce the cost of their next attachment by 1');

        this.conflictAction('Discard an attachment')
            .target('target', {
                cardCondition: (card, context) => !!(card.hasSomeTrait('item', 'weapon', 'armor') && card.parentCharacter && context.player.opponent && card.parentCharacter.isParticipatingFor(context.player.opponent)),
                cardType: CardType.Attachment
            }, AbilityDsl.actions.discardFromPlay())
            .then((context) => ({
                message: '{3} gains +2{4} due to discarding a weapon!',
                messageArgs: () => [context.source, 'military'],
                thenCondition: () => context.target?.hasTrait('weapon'),
                gameAction: AbilityDsl.actions.cardLastingEffect({
                    target: context.source,
                    effect: AbilityDsl.effects.modifyMilitarySkill(2)
                })
            }));
    }
}
