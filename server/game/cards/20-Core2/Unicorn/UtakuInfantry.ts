import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';
import type Player from '../../../Player.js';

function getNoOfUnicornCharacters(player: Player) {
    return player.cardsInPlay.filter((card: DrawCard) => card.isParticipating() && card.isFaction('unicorn')).length;
}

export default class UtakuInfantry extends DrawCard {
    static id = 'utaku-infantry';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isParticipating(),
            effect: AbilityDsl.effects.modifyBothSkills((card: DrawCard) => getNoOfUnicornCharacters(card.controller))
        });
    }
}
