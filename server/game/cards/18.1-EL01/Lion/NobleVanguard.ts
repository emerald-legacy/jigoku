import DrawCard from '../../../DrawCard.js';
import { CardType, DeckType, Players } from '../../../Constants.js';
import { attach } from '../../../GameActions/GameActions.js';
import Soldier from '../../Soldier.js';
import { soldierAttachCheck } from '../../soldierAttachCheck.js';

class NobleVanguard extends DrawCard {
    static id = 'noble-vanguard';

    override setupCardAbilities() {
        const canAttachSoldier = soldierAttachCheck(this.owner);

        this.reaction('Attach a follower to a character')
            .when({
                onCharacterEntersPlay: (event, context) => event.card === context.source && context.player.conflictDeck.length > 0
            })
            .target({
                cardType: CardType.Character,
                controller: Players.Any,
                cardCondition: (card, context) => canAttachSoldier(card, context)
            })
            .tokenFromTopCard((context) => ({
                deck: DeckType.Conflict,
                token: Soldier,
                gameAction: (token) => attach({ target: context.target, attachment: token })
            }))
            .chatText('attach the top card of their conflict deck to {0} as a +1/+1 attachment');
    }
}


export default NobleVanguard;
