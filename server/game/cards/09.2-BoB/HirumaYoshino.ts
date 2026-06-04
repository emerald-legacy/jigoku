import DrawCard from '../../DrawCard.js';
import { Location, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import type { AbilityContext } from '../../AbilityContext.js';

class HirumaYoshino extends DrawCard {
    static id = 'hiruma-yoshino';

    setupCardAbilities() {
        this.action<DrawCard>({
            title: 'Contribute printed military skill',
            condition: context => context.game.isDuringConflict('military') && context.source.isParticipating(),
            target: {
                cardType: CardType.Character,
                location: Location.Provinces,
                cardCondition: card => card.isInConflictProvince() &&
                    card.printedMilitarySkill > 0,
                gameAction: AbilityDsl.actions.cardLastingEffect({
                    targetLocation: Location.Provinces,
                    effect: [
                        AbilityDsl.effects.contributeToConflict((card: DrawCard, context: AbilityContext) => context.player),
                        AbilityDsl.effects.changeContributionFunction((card: DrawCard) => card.printedMilitarySkill)
                    ]
                })
            },
            effect: 'contribute {0}\'s printed {1} skill of {2} to their side of the conflict',
            effectArgs: context => ['military', context.target?.printedMilitarySkill ?? 0]
        });
    }
}


export default HirumaYoshino;
