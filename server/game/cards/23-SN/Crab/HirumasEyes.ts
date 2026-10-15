import { msg } from '../../../GameChat.js';
import DrawCard from '../../../DrawCard.js';
import { Location, Players, CardType } from '../../../Constants.js';
import { modifyMilitarySkill } from '../../../effects.js';
import { cardLastingEffect } from '../../../GameActions/GameActions.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import type BaseCard from '../../../BaseCard.js';

export default class HirumasEyes extends DrawCard {
    static id = 'hiruma-s-eyes';

    setupCardAbilities() {
        this.conflictAction('Give skill bonus or penalty')
            .target({
                name: 'provinceCard',
                location: Location.Provinces,
                cardType: CardType.Character,
                cardCondition: (card) => card.isInConflictProvince() && card.isFaceup() && card.getTraits().size > 0
            })
            .select({
                name: 'select',
                dependsOn: 'provinceCard',
                player: Players.Self
            }, {
                'Give +2': cardLastingEffect((context) => ({
                    target: this.getTargets(context.targets.provinceCard, context),
                    effect: modifyMilitarySkill(2)
                })),
                'Give -2': cardLastingEffect((context) => ({
                    target: this.getTargets(context.targets.provinceCard, context),
                    effect: modifyMilitarySkill(-2)
                }))
            })
            .chatText((context) => msg`give ${this.getTargets(context.targets.provinceCard, context)} ${context.selects.select.choice === 'Give +2' ? '+' : '-'}2${'military'} until the end of the conflict`);
    }

    getTargets(card: BaseCard, context: AbilityContext) {
        if(context.game.currentConflict) {
            const defenders = context.game.currentConflict.getDefenders();
            const traits = card.getTraits();

            return defenders.filter((a) => a.hasSomeTrait(traits));
        }

        return [];
    }
}
