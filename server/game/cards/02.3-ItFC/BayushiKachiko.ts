import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { bow, optional, sendHome, sequential } from '../../GameActions/GameActions.js';
import { CardType, ConflictType } from '../../Constants.js';

class BayushiKachiko extends DrawCard {
    static id = 'bayushi-kachiko';

    override setupCardAbilities() {
        this.action('Send a character home')
            .condition((context) => this.game.isDuringConflict(ConflictType.Political) && context.source.isParticipating())
            .target({
                cardType: CardType.Character,
                cardCondition: (card, context) => card.politicalSkill < context.source.politicalSkill && card.isParticipating()
            }, sequential([
                sendHome(),
                optional((context) => ({
                    activePromptTitle: 'Do you want to bow ' + context.target.name + '?',
                    gameAction: bow(),
                    acceptMessage: () => msg`${context.player} chooses to bow ${context.target} due to ${context.source}'s ability`
                }))
            ]));
    }
}


export default BayushiKachiko;
