import DrawCard from '../../DrawCard.js';
import { modifyGlory } from '../../effects.js';
import { Element } from '../../Constants.js';

const elementKey = 'fearsome-mystic-air';

class FearsomeMystic extends DrawCard {
    static id = 'fearsome-mystic';

    setupCardAbilities() {
        this.persistentEffect({
            condition: () => this.game.isDuringConflict(this.getCurrentElementSymbol(elementKey)),
            effect: modifyGlory(2)
        });

        this.action('Remove fate from characters')
            .condition((context) => context.source.isParticipating())
            .removeFate((context) => ({
                target: this.game.currentConflict?.getCharacters(context.player.opponent).filter((card) => card.glory < context.source.glory) ?? []
            }));
    }

    getPrintedElementSymbols() {
        const symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: '+2 Glory',
            element: Element.Air
        });
        return symbols;
    }
}


export default FearsomeMystic;
