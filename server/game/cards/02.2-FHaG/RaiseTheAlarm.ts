import DrawCard from '../../DrawCard.js';
import { CardType, Location, Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class RaiseTheAlarm extends DrawCard {
    static id = 'raise-the-alarm';

    setupCardAbilities() {
        this.action('Flip a dynasty card')
            .condition(context => this.game.isDuringConflict('military') && context.player.isDefendingPlayer())
            .target('target', {
                controller: Players.Self,
                location: Location.Provinces,
                cardCondition: (card) => card.isInConflictProvince() && card.isFacedown()
            }, AbilityDsl.actions.flipDynasty())
            .effect('flip the card in the conflict province faceup')
            .then((context) => ({
                handler: () => {
                    let card = context.target as DrawCard;
                    if(card.type === CardType.Character && card.allowGameAction('putIntoConflict', context)) {
                        this.game.addMessage('{0} is revealed and brought into the conflict!', card);
                        AbilityDsl.actions.putIntoConflict().resolve(card, context);
                    } else {
                        this.game.addMessage('{0} is revealed but cannot be brought into the conflict!', card);
                    }
                }
            }))
            .cannotBeMirrored();
    }
}


export default RaiseTheAlarm;
