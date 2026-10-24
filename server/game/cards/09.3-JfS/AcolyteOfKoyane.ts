import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { addKeyword, loseKeyword } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';
import { CardType, Players, ConflictType } from '../../Constants.js';

class AcolyteOfKoyane extends DrawCard {
    static id = 'acolyte-of-koyane';

    override setupCardAbilities() {
        this.action('Gain or lose pride')
            .condition((context) => context.game.isDuringConflict(ConflictType.Political))
            .target({
                name: 'character',
                controller: Players.Any,
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating()
            })
            .select({
                name: 'select',
                dependsOn: 'character'
            }, {
                'Gain Pride': {
                    action: cardLastingEffect((context) => ({
                        effect: addKeyword('pride'),
                        target: context.targets.character
                    })),
                    chatText: (context) => msg`give ${context.targets.character} Pride until the end of the conflict`
                },
                'Lose Pride': {
                    action: cardLastingEffect((context) => ({
                        effect: loseKeyword('pride'),
                        target: context.targets.character
                    })),
                    chatText: (context) => msg`make ${context.targets.character} lose Pride until the end of the conflict`
                }
            });
    }
}


export default AcolyteOfKoyane;

