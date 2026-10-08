import DrawCard from '../../DrawCard.js';
import { addKeyword, loseKeyword } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';
import { CardType, Players, ConflictType } from '../../Constants.js';

class AcolyteOfKoyane extends DrawCard {
    static id = 'acolyte-of-koyane';

    setupCardAbilities() {
        this.action('Gain or lose pride')
            .condition(context => context.game.isDuringConflict(ConflictType.Political))
            .target({
                name: 'character',
                controller: Players.Any,
                cardType: CardType.Character,
                cardCondition: card => card.isParticipating()
            })
            .select({
                name: 'select',
                dependsOn: 'character'
            }, {
                'Gain Pride': cardLastingEffect(context => ({
                    effect: addKeyword('pride'),
                    target: context.targets.character
                })),
                'Lose Pride': cardLastingEffect(context => ({
                    effect: loseKeyword('pride'),
                    target: context.targets.character
                }))
            })
            .chatText('{1} until the end of the conflict', context => [[context.selects.select.choice === 'Gain Pride' ? 'give {0} Pride' : 'make {0} lose Pride', context.targets.character]]);
    }
}


export default AcolyteOfKoyane;

