import DrawCard from '../../DrawCard.js';
import type Player from '../../Player.js';
import { CardType, Players, ConflictType } from '../../Constants.js';
import { dishonor } from '../../GameActions/GameActions.js';

class HidaBackbreaker extends DrawCard {
    static id = 'hida-backbreaker';

    override setupCardAbilities() {
        this.reaction('Dishonor a character')
            .when({
                afterConflict: (event, context) => event.conflict.isOnWinningSide(context.source) && context.game.isDuringConflict(ConflictType.Military)
            })
            .target({
                activePromptTitle: 'Choose a character to dishonor',
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card) => card.isParticipating()
            }, dishonor());
    }

    override allowAttachment(attachment: DrawCard, controller: Player = attachment.controller) {
        if(!this.isBlank() && controller === this.controller.opponent) {
            return false;
        }

        return super.allowAttachment(attachment, controller);
    }
}


export default HidaBackbreaker;
