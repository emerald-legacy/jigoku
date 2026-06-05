import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Element } from '../../Constants.js';

const elementKey = 'kaito-kosori-air';

class KaitoKosori extends DrawCard {
    static id = 'kaito-kosori';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context: AbilityContext) => {
                const symbol = this.getCurrentElementSymbol(elementKey);
                return context.player.cardsInPlay.some((card: any) => card.isParticipating()) &&
                    !!this.game.currentConflict &&
                    symbol !== 'none' &&
                    this.game.currentConflict.hasElement(symbol) &&
                    !(context.source as DrawCard).isParticipating() && !context.source.bowed;
            },
            effect: AbilityDsl.effects.contributeToConflict((_card: any, context: AbilityContext) => context.player)
        });
    }

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Conflict Type',
            element: Element.Air
        });
        return symbols;
    }

}


export default KaitoKosori;
