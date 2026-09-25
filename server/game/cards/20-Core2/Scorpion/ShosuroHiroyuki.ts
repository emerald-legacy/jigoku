import { CardType, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import type { ResolvedAbilityContext } from '../../../AbilityContext.js';
import DrawCard from '../../../DrawCard.js';

export default class ShosuroHiroyuki extends DrawCard {
    static id = 'shosuro-hiroyuki';

    setupCardAbilities() {
        this.action({
            title: 'Force opponent to discard card or dishonor a character',
            condition: (context) => context.source.isParticipating('political'),
            target: {
                cardType: CardType.Character,
                controller: Players.Any,
                cardCondition: (card: DrawCard, context) =>
                    card.isParticipating() && card.politicalSkill < context.source.politicalSkill,
                gameAction: AbilityDsl.actions.conditional(({ target }: ResolvedAbilityContext<DrawCard, DrawCard>) => ({
                    condition: () => target.isDishonored,
                    trueGameAction: AbilityDsl.actions.discardAtRandom({
                        amount: 1,
                        target: target.controller
                    }),
                    falseGameAction: AbilityDsl.actions.dishonor({ target })
                }))
            }
        });
    }
}
