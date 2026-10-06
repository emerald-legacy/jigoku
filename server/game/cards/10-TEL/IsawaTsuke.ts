import DrawCard from '../../DrawCard.js';
import type BaseCard from '../../BaseCard.js';
import { dishonor, honor } from '../../GameActions/GameActions.js';
import { Element, EventName } from '../../Constants.js';
import { isOwnRingEffect } from '../effectSource.js';

const elementKey = 'isawa-tsuke-fire';

class IsawaTsuke extends DrawCard {
    static id = 'isawa-tsuke';

    setupCardAbilities() {
        this.reaction('Fire ring same cost characters')
            .when({
                onCardDishonored: (event, context) =>
                    isOwnRingEffect(context.player, event.context) && this.getCurrentElementSymbol(elementKey) === Element.Fire,
                onCardHonored: (event, context) =>
                    isOwnRingEffect(context.player, event.context) && this.getCurrentElementSymbol(elementKey) === Element.Fire
            })
            .if((context) => context.event.name === EventName.OnCardDishonored)
                .gameAction(dishonor((context) => ({ target: this.getTsukeTargets(context.event.card) })))
            .otherwise()
                .gameAction(honor((context) => ({ target: this.getTsukeTargets(context.event.card) })));
    }
    getTsukeTargets(targetedCharacter: BaseCard) {
        if(!targetedCharacter.isDrawCard()) {
            return [];
        }
        return targetedCharacter.controller.cardsInPlay.filter(
            card => card.printedCost === targetedCharacter.printedCost
        );
    }

    getPrintedElementSymbols() {
        const symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Ring Effect',
            element: Element.Fire
        });
        return symbols;
    }
}


export default IsawaTsuke;
