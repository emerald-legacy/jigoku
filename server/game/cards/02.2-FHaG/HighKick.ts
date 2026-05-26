import DrawCard from '../../drawcard.js';
import { Players, CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class HighKick extends DrawCard {
    static id = 'high-kick';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Bow and Disable a character',
            condition: () => this.game.isDuringConflict('military'),
            cost: ability.costs.bow({
                cardType: CardTypes.Character,
                cardCondition: card => card.hasTrait('monk') && card.isParticipating()
            }),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Opponent,
                cardCondition: card => card.isParticipating(),
                gameAction: [
                    ability.actions.bow(),
                    ability.actions.cardLastingEffect({ effect: ability.effects.cardCannot('triggerAbilities') })
                ]
            },
            effect: 'bow {0} and prevent them from using abilities'
        });
    }
}


export default HighKick;
