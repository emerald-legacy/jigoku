import { modifyBothSkills } from '../../../effects.js';
import DrawCard from '../../../DrawCard.js';
import type Player from '../../../Player.js';

function getNoOfUnicornCharacters(player: Player) {
    return player.cardsInPlay.filter((card) => card.isParticipating() && card.isFaction('unicorn')).length;
}

export default class UtakuInfantry extends DrawCard {
    static id = 'utaku-infantry';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isParticipating(),
            effect: modifyBothSkills((card) => getNoOfUnicornCharacters(card.controller))
        });
    }
}
