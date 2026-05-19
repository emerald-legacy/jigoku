import DrawCard from '../../drawcard.js';
import { CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class ForthrightIde extends DrawCard {
    static id = 'forthright-ide';

    setupCardAbilities() {
        this.action({
            title: 'Ready a character',
            condition: (context) => context.source.isParticipating(),
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.costLessThan(4) && card.bowed,
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.ready(),
                    AbilityDsl.actions.chosenDiscard(context => ({
                        amount: context.target.controller === context.player ? 1 : 0,
                        target: context.player
                    }))
                ])
            }
        });
    }
}


export default ForthrightIde;
