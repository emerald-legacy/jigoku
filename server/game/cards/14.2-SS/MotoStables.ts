import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import { perRound } from '../../AbilityLimit.js';
import { modifyMilitarySkill } from '../../effects.js';
import { msg } from '../../GameChat.js';

class MotoStables extends DrawCard {
    static id = 'moto-stables';

    setupCardAbilities() {
        this.reaction('Give +2 military')
            .when({
                onMoveToConflict: (event, context) =>
                    event.card.type === CardType.Character &&
                    event.card.isParticipating() &&
                    event.card.controller === context.player
            })
            .cardLastingEffect((context) => ({
                target: context.event.card,
                effect: modifyMilitarySkill(2)
            }))
            .chatText((context) => msg`give ${context.event.card} +2${'military'}`)
            .limit(perRound(2));
    }
}


export default MotoStables;
