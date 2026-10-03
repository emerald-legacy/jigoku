import DrawCard from '../../DrawCard.js';
import { Location, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class HirumaYoshino extends DrawCard {
    static id = 'hiruma-yoshino';

    setupCardAbilities() {
        this.action('Contribute printed military skill')
            .condition(context => context.game.isDuringConflict('military') && context.source.isParticipating())
            .target('target', {
                cardType: CardType.Character,
                location: Location.Provinces,
                cardCondition: card => card.isInConflictProvince() &&
                    card.printedMilitarySkill > 0
            }, AbilityDsl.actions.cardLastingEffect({
                targetLocation: Location.Provinces,
                effect: [
                    AbilityDsl.effects.contributeToConflict((card, context) => context.player),
                    AbilityDsl.effects.changeContributionFunction((card) => card.printedMilitarySkill)
                ]
            }))
            .effect('contribute {0}\'s printed {1} skill of {2} to their side of the conflict', context => ['military', context.target?.printedMilitarySkill ?? 0]);
    }
}


export default HirumaYoshino;
