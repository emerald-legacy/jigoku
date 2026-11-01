import DrawCard from '../../DrawCard.js';
import { contributeToConflict } from '../../effects.js';
import { Element } from '../../Constants.js';

const elementKey = 'kaito-kosori-air';

class KaitoKosori extends DrawCard {
    static id = 'kaito-kosori';

    override setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => {
                const symbol = this.getCurrentElementSymbol(elementKey);
                return context.player.cardsInPlay.some((card) => card.isParticipating()) &&
                    this.game.isDuringConflict(symbol) &&
                    !context.source.isParticipating() && !context.source.bowed;
            },
            effect: contributeToConflict((_card, context) => context.player)
        });
    }

    protected override printedElementSymbols = [
        {
            key: elementKey,
            prettyName: 'Conflict Type',
            element: Element.Air
        }
    ];

}


export default KaitoKosori;
