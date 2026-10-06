import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class SeizeTheMind extends DrawCard {
    static id = 'seize-the-mind';

    setupCardAbilities() {
        this.conflictAction('Take control of a character')
            .target({
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: card => !card.isUnique()
            }, AbilityDsl.actions.multiple([
                AbilityDsl.actions.loseHonor((context) => ({
                    target: context.player,
                    amount: context.target?.getFate() ?? 0
                })),
                AbilityDsl.actions.cardLastingEffect(context => ({
                    effect: AbilityDsl.effects.takeControl(context.player)
                }))
            ]))
            .effect('take control of {0}{1}{2}{3}', context => {
                const fate = context.target.getFate();
                return fate > 0 ? [' and lose ', fate, ' honor'] : ['', '', ''];
            });
    }

    isTemptationsMaho() {
        return true;
    }
}


export default SeizeTheMind;
