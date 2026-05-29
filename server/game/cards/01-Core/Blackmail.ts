import DrawCard from '../../DrawCard.js';
import { Players, CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import { AbilityContext } from '../../AbilityContext.js';

class Blackmail extends DrawCard {
    static id = 'blackmail';

    setupCardAbilities() {
        this.action({
            title: 'Take control of a character',
            condition: () => this.game.isDuringConflict(),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Opponent,
                cardCondition: (card, context) => !card.anotherUniqueInPlay(context.player) && card.costLessThan(3),
                gameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                    effect: AbilityDsl.effects.takeControl(context.player)
                }))
            },
            effect: 'take control of {0}'
        });
    }

    canPlay(context: AbilityContext, playType: string = 'play'): boolean {
        if(context.player.opponent && context.player.isLessHonorable()) {
            return super.canPlay(context, playType);
        }
        return false;
    }
}


export default Blackmail;
