import DrawCard from '../../DrawCard.js';
import { Players, CardTypes, Elements } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

const elementKey = 'alchemical-laboratory-fire';

class AlchemicalLaboratory extends DrawCard {
    static id = 'alchemical-laboratory';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => (
                this.game.rings[this.getCurrentElementSymbol(elementKey)].isConsideredClaimed(context.player)
            ),
            match: (card, context) => card.getType() === CardTypes.Attachment && card.parent !== null && card.parent !== undefined && card.parent.controller !== context?.player,
            effect: AbilityDsl.effects.addKeyword('ancestral'),
            targetController: Players.Self
        });
    }

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Claimed Ring',
            element: Elements.Fire
        });
        return symbols;
    }
}


export default AlchemicalLaboratory;
