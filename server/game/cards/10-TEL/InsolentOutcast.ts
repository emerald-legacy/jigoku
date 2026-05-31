import type AbilityDsl from '../../abilitydsl.js';
import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';
import type Player from '../../Player.js';

class InsolentOutcast extends DrawCard {
    static id = 'insolent-outcast';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.persistentEffect({
            effect: ability.effects.modifyBothSkills((card: any, context: AbilityContext) => context.player.opponent ? this.getNoOfHonoredCharacters(context.player.opponent) : 0)
        });
    }

    getNoOfHonoredCharacters(player: Player) {
        return player.cardsInPlay.filter((card: any) => card.getType() === 'character' && card.isHonored).length;
    }
}


export default InsolentOutcast;
