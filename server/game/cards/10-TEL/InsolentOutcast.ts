import DrawCard from '../../drawcard.js';

class InsolentOutcast extends DrawCard {
    static id = 'insolent-outcast';

    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.modifyBothSkills((card, context) => context.player.opponent && this.getNoOfHonoredCharacters(context.player.opponent))
        });
    }

    getNoOfHonoredCharacters(player) {
        return player.cardsInPlay.filter(card => card.getType() === 'character' && card.isHonored).length;
    }
}


export default InsolentOutcast;
