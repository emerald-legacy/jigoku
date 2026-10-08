import { CardType, ConflictType } from '../../../Constants.js';
import { bow, multiple, onAffinity, taint } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import { controlsShugenja } from '../../controlsShugenja.js';
import { msg } from '../../../GameChat.js';

export default class EarthsExamination extends DrawCard {
    static id = 'earth-s-examination';

    setupCardAbilities() {
        this.action('Taint a character')
            .condition((context) =>
                context.game.isDuringConflict(ConflictType.Political) && controlsShugenja(context.player))
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating()
            }, multiple([
                taint(),
                onAffinity((context) => ({
                    trait: 'earth',
                    prompt: context.target.isTainted ? undefined : 'Bow that character?',
                    gameAction: bow(),
                    effect: 'bow {0}',
                    effectArgs: (context) => [context.target]
                }))
            ]))
            .effect((context) => msg`reveal ${context.target ?? ''}'s corruption`);
    }
}
