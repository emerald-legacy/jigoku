import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { atEndOfConflict, discardStatusToken, honor, multiple } from '../../GameActions/GameActions.js';
import { CardType, Trait } from '../../Constants.js';

class PurityOfSpirit extends DrawCard {
    static id = 'purity-of-spirit';

    override setupCardAbilities() {
        this.action('Choose a bushi character to honor')
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.hasTrait(Trait.Bushi) && card.isParticipating()
            }, multiple([
                honor(),
                atEndOfConflict((context) => ({
                    message: () => msg`${context.target.statusTokens} ${context.target.statusTokens.length > 1 ? 'are' : 'is'} removed from ${context.target} due to the delayed effect of ${context.source}`,
                    gameAction: discardStatusToken(() => ({ target: context.target.statusTokens }))
                }))
            ]))
            .chatText('honor {0}. Their status token will be discarded at the end of the conflict');
    }
}


export default PurityOfSpirit;
