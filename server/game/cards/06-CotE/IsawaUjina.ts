import DrawCard from '../../drawcard.js';
import { CardTypes, Elements } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

const elementKey = 'isawa-ujina-void';

class IsawaUjina extends DrawCard {
    static id = 'isawa-ujina';

    setupCardAbilities() {
        this.forcedReaction({
            title: 'Remove a character from the game',
            when: {
                onClaimRing: (event) => {
                    const element = this.getCurrentElementSymbol(elementKey) || Elements.Void;
                    return (event.conflict && event.conflict.ring.hasElement(element)) || event.ring.hasElement(element);
                }
            },
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.getFate() === 0,
                gameAction: AbilityDsl.actions.removeFromGame()
            },
            limit: AbilityDsl.limit.unlimitedPerConflict()
        });
    }

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Claimed Ring',
            element: Elements.Void
        });
        return symbols;
    }
}


export default IsawaUjina;
