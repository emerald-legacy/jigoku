import { CardType, ConflictType } from '../../../Constants.js';
import { bow, onAffinity, taint } from '../../../GameActions/GameActions.js';
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
            }, taint(), onAffinity({
                trait: 'earth',
                activePromptTitle: 'Bow that character?',
                gameAction: bow(),
                chatText: (context) => msg`bow ${context.target}`
            }))
            .chatText((context) => msg`reveal ${context.target ?? ''}'s corruption`);
    }
}
