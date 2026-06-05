import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { PlayCharacterIntoLocation, PlayCharacterAction } from '../../PlayCharacterAction.js';
import { Element, Location, PlayType } from '../../Constants.js';
import type Player from '../../Player.js';
import type { AbilityContext } from '../../AbilityContext.js';

const elementKey = 'isawa-skycaller-air';

class IsawaSkycallerPlayAction extends PlayCharacterAction {
    static id = 'isawa-skycaller';

    constructor(card: DrawCard) {
        super(card, PlayCharacterIntoLocation.Conflict);
    }

    createContext(player: Player = this.card.controller) {
        const context = super.createContext(player);
        context.playType = PlayType.PlayFromHand;
        return context;
    }

    meetsRequirements(context: AbilityContext<DrawCard>, ignoredRequirements: string[] = []): string {
        const newIgnoredRequirements = ignoredRequirements.includes('location') ? ignoredRequirements : ignoredRequirements.concat('location');
        return super.meetsRequirements(context, newIgnoredRequirements);
    }
}

class IsawaSkycaller extends DrawCard {
    static id = 'isawa-skycaller';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.game.isDuringConflict(this.getCurrentElementSymbol(elementKey)),
            targetLocation: Location.Provinces,
            match: card => card.isDynasty && card.isFaceup(),
            effect: AbilityDsl.effects.gainPlayAction(IsawaSkycallerPlayAction)
        });
    }


    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Contested Ring',
            element: Element.Air
        });
        return symbols;
    }
}


export default IsawaSkycaller;
