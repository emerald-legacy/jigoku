import { CardType, DuelType, Duration, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';
import type { TriggeredAbilityContext } from '../../../TriggeredAbilityContext.js';
import type BaseCard from '../../../BaseCard.js';
import type Player from '../../../Player.js';

function getAttachmentSkill(card: DrawCard) {
    let amount = 0;

    const mil = parseInt(card.cardData.military_bonus ?? '');
    if(!isNaN(mil)) {
        amount += mil;
    }

    const pol = parseInt(card.cardData.political_bonus ?? '');
    if(!isNaN(pol)) {
        amount += pol;
    }

    return amount;
}

export default class BitingSteel extends DrawCard {
    static id = 'biting-steel';

    public setupCardAbilities() {
        this.duelChallenge({
            title: 'Add a Weapon to your duel stats',
            duelCondition: (duel, context) =>
                (duel.duelType === DuelType.Military || duel.duelType === DuelType.Political) &&
                duel.isInvolved((context.source as DrawCard).parent as DrawCard),
            target: {
                cardType: CardType.Attachment,
                cardCondition: (card: DrawCard, context) =>
                    !!card.parent && card.parent === context.source.parent && card.hasTrait('weapon') && getAttachmentSkill(card) !== 0,
                gameAction: AbilityDsl.actions.cardLastingEffect<DrawCard>((context) => ({
                    target: context.target?.parent ?? undefined,
                    effect: AbilityDsl.effects.modifyDuelistSkill(
                        context.target ? getAttachmentSkill(context.target) : 0,
                        (context as TriggeredAbilityContext<BaseCard, DrawCard>).event.duel
                    ),
                    duration: Duration.UntilEndOfDuel
                }))
            },
            effect: 'add the skill bonus of {0} ({1}) to their duel total',
            effectArgs: (context) => [context.target ? getAttachmentSkill(context.target as DrawCard) : 0]
        });

        this.action({
            title: 'Send an enemy home',
            condition: (context) =>
                !!(context.source.parent as DrawCard | undefined)?.isParticipating('military') &&
                (context.player as Player).hasAffinity('fire', context),
            target: {
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card: DrawCard, context) => card.militarySkill < context.source.parent.militarySkill,
                gameAction: AbilityDsl.actions.sendHome()
            }
        });
    }

    public canAttach(card: BaseCard) {
        return (
            card.getType() === CardType.Character &&
            (card as DrawCard).attachments.some((c: DrawCard) => c.hasTrait('weapon')) &&
            super.canAttach(card)
        );
    }

    public canPlay(context: TriggeredAbilityContext, playType: string) {
        return (
            context.player.cardsInPlay.some(
                (card: DrawCard) => card.getType() === CardType.Character && card.hasTrait('shugenja')
            ) && super.canPlay(context, playType)
        );
    }
}
