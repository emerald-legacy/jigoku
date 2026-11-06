import DrawCard from '../../DrawCard.js';
import { gainPlayAction } from '../../effects.js';
import { PlayIntoLocation } from '../../PlayCharacterAction.js';
import { PlayCharacterAsIfFromHand } from '../../PlayCharacterAsIfFromHand.js';
import { Element, Location } from '../../Constants.js';

const elementKey = 'isawa-skycaller-air';

class IsawaSkycaller extends DrawCard {
    static id = 'isawa-skycaller';

    override setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.game.isDuringConflict(this.getCurrentElementSymbol(elementKey)),
            targetLocation: Location.Provinces,
            match: (card) => card.isDynasty && card.isFaceup(),
            effect: gainPlayAction((card) => new PlayCharacterAsIfFromHand(card, { into: PlayIntoLocation.Conflict }))
        });
    }


    protected override printedElementSymbols = [
        {
            key: elementKey,
            prettyName: 'Contested Ring',
            element: Element.Air
        }
    ];
}


export default IsawaSkycaller;
