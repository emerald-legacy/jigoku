import DrawCard from '../../drawcard.js';
import { CardTypes, Locations } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class WayOfTheOpenHand extends DrawCard {
    static id = 'way-of-the-open-hand';

    setupCardAbilities() {
        this.action({
            title: 'Send home opponent\'s character',
            condition: context => context.game.isDuringConflict() && !context.game.currentConflict.getConflictProvinces().some(a => a.location === Locations.StrongholdProvince),
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card, context) => card.isParticipating() && card.controller !== context.player,
                gameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.sendHome(),
                    AbilityDsl.actions.placeFate()
                ])
            },
            effect: 'send home and place a fate on {0}'
        });
    }
}


export default WayOfTheOpenHand;
