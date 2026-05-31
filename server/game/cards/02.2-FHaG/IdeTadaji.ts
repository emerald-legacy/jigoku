import DrawCard from '../../DrawCard.js';
import { Players, CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class IdeTadaji extends DrawCard {
    static id = 'ide-tadaji';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Move characters into conflict',
            condition: context => context.source.isParticipating(),
            targets: {
                myChar: {
                    cardType: CardTypes.Character,
                    controller: Players.Self,
                    cardCondition: card => !card.bowed && card.costLessThan(3),
                    gameAction: ability.actions.moveToConflict()
                },
                oppChar: {
                    cardType: CardTypes.Character,
                    controller: Players.Opponent,
                    cardCondition: card => !card.bowed && card.costLessThan(3),
                    gameAction: ability.actions.moveToConflict()
                }
            }
        });
    }
}


export default IdeTadaji;
