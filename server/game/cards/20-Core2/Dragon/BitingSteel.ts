import { msg } from '../../../GameChat.js';
import { CardType, Duration, Players, ConflictType, Trait } from '../../../Constants.js';
import { modifyDuelistSkill } from '../../../effects.js';
import { cardLastingEffect, sendHome } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import { controlsShugenja } from '../../controlsShugenja.js';

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

    public override setupCardAbilities() {
        this.playOnlyIf((context) => controlsShugenja(context.player));

        this.attachmentConditions({
            myControl: true,
            cardCondition: (card) => card.attachments.some((attachment) => attachment.hasTrait(Trait.Weapon))
        });

        this.duelChallenge('Add a Weapon to your duel stats', (duel, context) =>
            !!context.source.parentCharacter && duel.isInvolved(context.source.parentCharacter))
            .target({
                cardType: CardType.Attachment,
                cardCondition: (card, context) =>
                    !!card.parentCharacter && card.parentCharacter === context.source.parentCharacter && card.hasTrait(Trait.Weapon) && getAttachmentSkill(card) !== 0
            }, cardLastingEffect((context) => ({
                target: context.target?.parentCharacter ?? undefined,
                effect: modifyDuelistSkill(
                    context.target ? getAttachmentSkill(context.target) : 0,
                    context.event.duel
                ),
                duration: Duration.UntilEndOfDuel
            })))
            .chatText((context) => msg`add the skill bonus of ${context.chatTarget()} (${getAttachmentSkill(context.target)}) to their duel total`);

        this.conflictAction('Send an enemy home', { conflictType: ConflictType.Military })
            .ifCondition((context) => context.player.hasAffinity(Trait.Fire, context))
            .target({
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card, context) => card.militarySkill < (context.source.parentCharacter?.militarySkill ?? 0)
            }, sendHome());
    }
}
