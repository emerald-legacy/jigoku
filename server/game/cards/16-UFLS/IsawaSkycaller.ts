import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { PlayCharacterIntoLocation, PlayCharacterAction } from '../../PlayCharacterAction.js';
import { Elements, Locations, PlayTypes } from '../../Constants.js';

const elementKey = 'isawa-skycaller-air';

class IsawaSkycallerPlayAction extends PlayCharacterAction {
    static id = 'isawa-skycaller';

    constructor(card) {
        super(card, PlayCharacterIntoLocation.Conflict);
    }

    createContext(player = this.card.controller) {
        const context = super.createContext(player);
        context.playType = PlayTypes.PlayFromHand;
        return context;
    }

    meetsRequirements(context, ignoredRequirements = []) {
        let newIgnoredRequirements = ignoredRequirements.includes('location') ? ignoredRequirements : ignoredRequirements.concat('location');
        return super.meetsRequirements(context, newIgnoredRequirements);
    }
}

class IsawaSkycaller extends DrawCard {
    static id = 'isawa-skycaller';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.game.isDuringConflict(this.getCurrentElementSymbol(elementKey)),
            targetLocation: Locations.Provinces,
            match: card => card.isDynasty && card.isFaceup(),
            effect: AbilityDsl.effects.gainPlayAction(IsawaSkycallerPlayAction)
        });
    }


    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Contested Ring',
            element: Elements.Air
        });
        return symbols;
    }
}


export default IsawaSkycaller;
