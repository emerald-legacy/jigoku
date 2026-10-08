import DrawCard from '../../DrawCard.js';
import { Element } from '../../Constants.js';

const elementKey = 'seeker-of-knowledge-air';

class WanderingMediator extends DrawCard {
    static id = 'wandering-mediator';

    setupCardAbilities() {
        this.action('Move in/out the conflict')
            .condition((context) => context.game.currentConflict?.getConflictProvinces().some((a) => a.isElement(this.getCurrentElementSymbol(elementKey))) ?? false)
            .if((context) => context.source.isDrawCard() && context.source.isParticipating())
                .sendHome((context) => ({ target: context.source }))
            .otherwise()
                .moveToConflict((context) => ({ target: context.source }));
    }

    getPrintedElementSymbols() {
        const symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Province Element',
            element: Element.Air
        });
        return symbols;
    }
}


export default WanderingMediator;
