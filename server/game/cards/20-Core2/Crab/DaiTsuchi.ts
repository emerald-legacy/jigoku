import { AbilityType, CardType, ConflictType } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class DaiTsuchi extends DrawCard {
    static id = 'dai-tsuchi';

    public setupCardAbilities() {
        this.attachmentConditions({
            cardCondition: (card) => card.printedMilitarySkill >= 3
        });

        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility(AbilityType.Action, {
                title: 'Return attachment to owners hand',
                condition: (context) => context.source.isParticipating(ConflictType.Military),
                target: {
                    cardType: CardType.Attachment,
                    cardCondition: (card, context) =>
                        !!context.player.opponent &&
                        !!card.parentCharacter?.isParticipatingFor(context.player.opponent),
                    gameAction: AbilityDsl.actions.returnToHand()
                },
                gameAction: AbilityDsl.actions.playerLastingEffect((context) => ({
                    targetController: context.target?.owner,
                    effect: AbilityDsl.effects.playerCannot({
                        cannot: 'play',
                        restricts: 'copiesOfX',
                        params: context.target?.name
                    })
                })),
                effect: 'return {0} to {1}\'s hand and prevent them from playing copies this conflict',
                effectArgs: (context) => [context.target?.owner ?? '']
            })
        });
    }
}
