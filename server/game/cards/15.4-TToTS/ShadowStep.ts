import DrawCard from '../../DrawCard.js';
import { CardType, Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class ShadowStep extends DrawCard {
    static id = 'shadow-step';

    setupCardAbilities() {
        this.action({
            title: 'Remove a character from the game and put it into play',
            target: {
                cardType: CardType.Character,
                cardCondition: card => !card.hasTrait('mythic'),
                controller: Players.Self,
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.removeFromGame(context => ({
                        target: context.target
                    })),
                    AbilityDsl.actions.conditional({
                        condition: context => {
                            return context.target.hasTrait('shadow');
                        },
                        trueGameAction: AbilityDsl.actions.putIntoPlay(context => ({
                            target: context.target
                        })),
                        falseGameAction: AbilityDsl.actions.putIntoPlay(context => ({
                            target: context.target,
                            status: 'dishonored'
                        }))
                    })
                ])
            },
            effect: 'remove {0} from the game, then put it back into play'
        });
    }
}


export default ShadowStep;
