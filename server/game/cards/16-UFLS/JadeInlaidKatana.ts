import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { AbilityType, CardType, Players } from '../../Constants.js';

class JadeInlaidKatana extends DrawCard {
    static id = 'jade-inlaid-katana';

    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility(AbilityType.Reaction, {
                title: 'Remove 1 fate from a character',
                printedAbility: false,
                when: {
                    afterConflict: (event, context) =>
                        context.source.isParticipating() && event.conflict.winner === context.source.controller
                },
                target: {
                    cardType: CardType.Character,
                    controller: Players.Any,
                    cardCondition: (card) => {
                        return card.hasStatusTokens && card.isParticipating();
                    },
                    gameAction: AbilityDsl.actions.removeFate()
                }
            })
        });
    }
}


export default JadeInlaidKatana;
