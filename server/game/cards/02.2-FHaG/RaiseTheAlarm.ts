import DrawCard from '../../DrawCard.js';
import { CardType, Location, Players, ConflictType } from '../../Constants.js';
import { flipDynasty, putIntoConflict } from '../../GameActions/GameActions.js';

class RaiseTheAlarm extends DrawCard {
    static id = 'raise-the-alarm';

    setupCardAbilities() {
        this.action('Flip a dynasty card')
            .condition(context => this.game.isDuringConflict(ConflictType.Military) && context.player.isDefendingPlayer())
            .target({
                controller: Players.Self,
                location: Location.Provinces,
                cardCondition: (card) => card.isInConflictProvince() && card.isFacedown()
            }, flipDynasty())
            .effect('flip the card in the conflict province faceup')
            .then((context) => ({
                handler: () => {
                    const card = context.target;
                    if(card.type === CardType.Character && card.allowGameAction('putIntoConflict', context)) {
                        this.game.addMessage('{0} is revealed and brought into the conflict', card);
                        putIntoConflict().resolve(card, context);
                    } else {
                        this.game.addMessage('{0} is revealed but cannot be brought into the conflict', card);
                    }
                }
            }))
            .cannotBeMirrored();
    }
}


export default RaiseTheAlarm;
