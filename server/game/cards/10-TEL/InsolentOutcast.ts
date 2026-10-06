import { modifyBothSkills } from '../../effects.js';
import { CardType } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import type Player from '../../Player.js';

class InsolentOutcast extends DrawCard {
    static id = 'insolent-outcast';

    setupCardAbilities() {
        this.persistentEffect({
            effect: modifyBothSkills((_card, context) => context.player.opponent ? this.getNoOfHonoredCharacters(context.player.opponent) : 0)
        });
    }

    getNoOfHonoredCharacters(player: Player) {
        return player.cardsInPlay.filter(card => card.getType() === CardType.Character && card.isHonored).length;
    }
}


export default InsolentOutcast;
