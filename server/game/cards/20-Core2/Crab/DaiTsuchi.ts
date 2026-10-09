import { msg } from '../../../GameChat.js';
import { CardType, ConflictType, RestrictionType, RestrictionScope } from '../../../Constants.js';
import { gainAbility, playerCannot } from '../../../effects.js';
import { returnToHand } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class DaiTsuchi extends DrawCard {
    static id = 'dai-tsuchi';

    public setupCardAbilities() {
        this.attachmentConditions({
            cardCondition: (card) => card.printedMilitarySkill >= 3
        });

        this.whileAttached({
            effect: gainAbility.action('Return attachment to owners hand', (ability) => ability
                .condition((context) => context.source.isParticipating(ConflictType.Military))
                .target({
                    cardType: CardType.Attachment,
                    cardCondition: (card, context) =>
                        !!context.player.opponent &&
                        !!card.parentCharacter?.isParticipatingFor(context.player.opponent)
                }, returnToHand())
                .playerLastingEffect((context) => ({
                    targetController: context.target?.owner,
                    effect: playerCannot({
                        cannot: RestrictionType.Play,
                        appliesTo: RestrictionScope.CopiesOfX,
                        params: context.target?.name
                    })
                }))
                .chatText((context) => msg`return ${context.chatTarget()} to ${context.target?.owner ?? ''}'s hand and prevent them from playing copies this conflict`))
        });
    }
}
