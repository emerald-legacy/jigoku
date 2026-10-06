import DrawCard from '../../DrawCard.js';
import { conditional, dishonor, honor } from '../../GameActions/GameActions.js';
import { CardType, CharacterStatus, ConflictType } from '../../Constants.js';

class AGameOfLetters extends DrawCard {
    static id = 'a-game-of-letters';

    setupCardAbilities() {
        this.conflictAction('Honor or dishonor a character', { conflictType: ConflictType.Political })
            .tokenTarget({
                name: 'token',
                activePromptTitle: 'Choose a token',
                cardType: CardType.Character,
                tokenCondition: token => token.grantedStatus === CharacterStatus.Honored || token.grantedStatus === CharacterStatus.Dishonored
            })
            .target({
                name: 'character',
                activePromptTitle: 'Choose a character',
                dependsOn: 'token',
                cardType: CardType.Character,
                cardCondition: (card, context) => card.controller !== context.tokens.token[0].card?.controller && card.isParticipating()
            }, conditional((context) => ({
                condition: context.tokens.token[0].grantedStatus === CharacterStatus.Honored,
                trueGameAction: honor(),
                falseGameAction: dishonor()
            })));
    }
}


export default AGameOfLetters;
