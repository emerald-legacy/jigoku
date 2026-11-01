import DrawCard from '../../DrawCard.js';
import { Element } from '../../Constants.js';

const elementKey = 'wandering-mediator-air';

class WanderingMediator extends DrawCard {
    static id = 'wandering-mediator';

    override setupCardAbilities() {
        this.action('Move in/out the conflict')
            .condition((context) => context.game.currentConflict?.getConflictProvinces().some((a) => a.isElement(this.getCurrentElementSymbol(elementKey))) ?? false)
            .if((context) => context.source.isParticipating())
                .sendHome()
            .otherwise()
                .moveToConflict();
    }

    protected override printedElementSymbols = [
        {
            key: elementKey,
            prettyName: 'Province Element',
            element: Element.Air
        }
    ];
}


export default WanderingMediator;
