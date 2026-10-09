import { msg } from '../../GameChat.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import { selectRing, switchConflictElement } from '../../GameActions/GameActions.js';

export default class ElementalFury extends ProvinceCard {
    static id = 'elemental-fury';

    setupCardAbilities() {
        this.reaction('Switch the contested ring')
            .when({
                onCardRevealed: (event, context) => event.card === context.source && this.game.isDuringConflict()
            })
            .gameAction(selectRing({
                message: (_context, ring, player) => msg`${player} switches the contested ring with ${ring}`,
                ringCondition: (ring) => ring.isUnclaimed(),
                gameAction: switchConflictElement()
            }))
            .chatText('switch the contested ring with an unclaimed one');
    }
}
