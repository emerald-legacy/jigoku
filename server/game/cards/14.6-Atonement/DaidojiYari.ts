import DrawCard from '../../DrawCard.js';
import { Players, CardType, Location } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class DaidojiYari extends DrawCard {
    static id = 'daidoji-yari';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => !!(context.player.opponent && context.player.showBid < context.player.opponent.showBid),
            targetController: Players.Opponent,
            targetLocation: Location.PlayArea,
            match: card => card.type === CardType.Character,
            effect: AbilityDsl.effects.loseKeyword('covert')
        });
    }
}


export default DaidojiYari;
