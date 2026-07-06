import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class HighKick extends DrawCard {
    static id = 'high-kick';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Bow and Disable a character',
            condition: () => this.game.isDuringConflict('military'),
            cost: ability.costs.bow({
                cardType: CardType.Character,
                cardCondition: card => card.hasTrait('monk') && card.isParticipating()
            }),
            target: {
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: card => card.isParticipating(),
                gameAction: [
                    ability.actions.bow(),
                    ability.actions.cardLastingEffect({ effect: ability.effects.cannotTriggerAbilities() })
                ]
            },
            effect: 'bow {0} and prevent them from using abilities'
        });
    }
}


export default HighKick;
