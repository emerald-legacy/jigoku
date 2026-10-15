import DrawCard from '../../DrawCard.js';
import { modifyGlory } from '../../effects.js';
import { Element } from '../../Constants.js';

const elementKey = 'icon-of-favor-fire';

class IconOfFavor extends DrawCard {
    static id = 'icon-of-favor';

    setupCardAbilities() {
        this.whileAttached({
            condition: (context) => context.player.imperialFavor !== '',
            effect: modifyGlory(1)
        });
        this.reaction('Honor attached character')
            .when({
                afterConflict: (event, context) =>
                    event.conflict.hasElement(this.getCurrentElementSymbol(elementKey)) &&
                    event.conflict.winner === context.player
            })
            .honor((context) => ({
                target: context.source.parentCharacter ?? []
            }));
    }

    getPrintedElementSymbols() {
        const symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Conflict Type',
            element: Element.Fire
        });
        return symbols;
    }
}


export default IconOfFavor;
