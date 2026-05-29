import DrawCard from '../../DrawCard.js';
import { Players, CardTypes, Durations } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class SeizeTheMind extends DrawCard {
    static id = 'seize-the-mind';

    setupCardAbilities() {
        this.action({
            title: 'Take control of a character',
            condition: () => this.game.isDuringConflict(),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Opponent,
                cardCondition: card => !card.isUnique(),
                gameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.loseHonor(context => ({
                        target: context.player,
                        amount: context.target.fate
                    })),
                    AbilityDsl.actions.cardLastingEffect(context => ({
                        effect: AbilityDsl.effects.takeControl(context.player),
                        duration: Durations.UntilEndOfConflict
                    }))
                ])
            },
            effect: 'take control of {0}{1}{2}{3}',
            effectArgs: context => {
                const target = context.target as DrawCard;
                return target.getFate() > 0 ? [' and lose ', target.getFate(), ' honor'] : ['', '', ''];
            }
        });
    }

    isTemptationsMaho() {
        return true;
    }
}


export default SeizeTheMind;
