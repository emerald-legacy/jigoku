import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Elements } from '../../Constants.js';

const elementKey = 'kaito-kosori-air';

class KaitoKosori extends DrawCard {
    static id = 'kaito-kosori';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context =>
                context.player.cardsInPlay.some(card => card.isParticipating()) &&
                this.game.currentConflict.hasElement(this.getCurrentElementSymbol(elementKey)) &&
                !context.source.isParticipating() && !context.source.bowed,
            effect: AbilityDsl.effects.contributeToConflict((card, context) => context.player)
        });
    }

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Conflict Type',
            element: Elements.Air
        });
        return symbols;
    }

}


export default KaitoKosori;
