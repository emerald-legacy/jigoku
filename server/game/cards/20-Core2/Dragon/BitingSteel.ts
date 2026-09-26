import { CardType, DuelType, Duration, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';
import type { TriggeredAbilityContext } from '../../../TriggeredAbilityContext.js';
import type BaseCard from '../../../BaseCard.js';

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
        this.duelChallenge('Add a Weapon to your duel stats', (duel, context) =>
            (duel.duelType === DuelType.Military || duel.duelType === DuelType.Political) &&
                !!context.source.parentCharacter && duel.isInvolved(context.source.parentCharacter))
            .target('target', {
                cardType: CardType.Attachment,
                cardCondition: (card, context) =>
                    !!card.parentCharacter && card.parentCharacter === context.source.parentCharacter && card.hasTrait('weapon') && getAttachmentSkill(card) !== 0
            }, AbilityDsl.actions.cardLastingEffect((context) => ({
                target: context.target?.parentCharacter ?? undefined,
                effect: AbilityDsl.effects.modifyDuelistSkill(
                    context.target ? getAttachmentSkill(context.target) : 0,
                    context.event.duel
                ),
                duration: Duration.UntilEndOfDuel
            })))
            .effect('add the skill bonus of {0} ({1}) to their duel total', (context) => [context.target ? getAttachmentSkill(context.target) : 0]);

        this.action('Send an enemy home')
            .condition((context) =>
                !!context.source.parentCharacter?.isParticipating('military') &&
                context.player.hasAffinity('fire', context))
            .target('target', {
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card, context) => card.militarySkill < (context.source.parentCharacter?.militarySkill ?? 0)
            }, AbilityDsl.actions.sendHome());
    }

    public canAttach(card: BaseCard) {
        return (
            card.getType() === CardType.Character &&
            card.attachments.some((c: DrawCard) => c.hasTrait('weapon')) &&
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
