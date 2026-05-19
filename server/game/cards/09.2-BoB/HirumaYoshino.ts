import DrawCard from '../../drawcard.js';
import { Locations, CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class HirumaYoshino extends DrawCard {
    static id = 'hiruma-yoshino';

    setupCardAbilities() {
        this.action({
            title: 'Contribute printed military skill',
            condition: context => context.game.isDuringConflict('military') && context.source.isParticipating(),
            target: {
                cardType: CardTypes.Character,
                location: Locations.Provinces,
                cardCondition: card => card.isInConflictProvince() &&
                    card.printedMilitarySkill > 0,
                gameAction: AbilityDsl.actions.cardLastingEffect({
                    targetLocation: Locations.Provinces,
                    effect: [
                        AbilityDsl.effects.contributeToConflict((card, context) => context.player),
                        AbilityDsl.effects.changeContributionFunction(card => card.printedMilitarySkill)
                    ]
                })
            },
            effect: 'contribute {0}\'s printed {1} skill of {2} to their side of the conflict',
            effectArgs: context => ['military', context.target.printedMilitarySkill]
        });
    }
}


export default HirumaYoshino;
