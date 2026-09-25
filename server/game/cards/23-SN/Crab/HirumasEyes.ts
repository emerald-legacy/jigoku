import DrawCard from '../../../DrawCard.js';
import { Location, Players, Duration, CardType } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import { AbilityContext } from '../../../AbilityContext.js';
import BaseCard from '../../../BaseCard.js';

export default class HirumasEyes extends DrawCard {
    static id = 'hiruma-s-eyes';

    setupCardAbilities() {
        this.action('Give skill bonus or penalty')
            .condition(context => context.game.isDuringConflict())
            .target('provinceCard', {
                location: Location.Provinces,
                cardType: CardType.Character,
                cardCondition: card => card.isInConflictProvince() && card.isFaceup() && card.getTraits().size > 0
            })
            .select('select', {
                dependsOn: 'provinceCard',
                player: Players.Self
            }, {
                'Give +2': AbilityDsl.actions.cardLastingEffect((context) => ({
                    target: this.getTargets(context.targets.provinceCard, context),
                    effect: AbilityDsl.effects.modifyMilitarySkill(2),
                    duration: Duration.UntilEndOfConflict
                })),
                'Give -2': AbilityDsl.actions.cardLastingEffect((context) => ({
                    target: this.getTargets(context.targets.provinceCard, context),
                    effect: AbilityDsl.effects.modifyMilitarySkill(-2),
                    duration: Duration.UntilEndOfConflict
                }))
            })
            .effect('give {1} {2}2{3} until the end of the conflict', context => [
                this.getTargets(context.targets.provinceCard, context),
                context.selects.select.choice === 'Give +2' ? '+' : '-',
                'military'
            ]);
    }

    getTargets(card: BaseCard, context: AbilityContext) {
        if(context.game.currentConflict) {
            const defenders = context.game.currentConflict.getDefenders();
            const traits = card.getTraits();

            return defenders.filter(a => a.hasSomeTrait(traits));
        }

        return [];
    }
}
