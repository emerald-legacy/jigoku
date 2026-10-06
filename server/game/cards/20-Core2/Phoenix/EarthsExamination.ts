import { CardType, ConflictType } from '../../../Constants.js';
import { bow, multiple, onAffinity, taint } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import { controlsShugenja } from '../../controlsShugenja.js';

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
                    promptTitleForConfirmingAffinity: context.target.isTainted ? undefined : 'Bow that character?',
                    gameAction: bow(),
                    effect: 'bow {0}',
                    effectArgs: (context) => [context.target]
                }))
            ]))
            .effect('reveal {1}\'s corruption', (context) => [context.target ?? '']);
    }
}
