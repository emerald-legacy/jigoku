import DrawCard from '../../DrawCard.js';
import type BaseCard from '../../BaseCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Element, EventName } from '../../Constants.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
import Ring from '../../Ring.js';
const elementKey = 'isawa-tsuke-fire';

class IsawaTsuke extends DrawCard {
    static id = 'isawa-tsuke';

    setupCardAbilities() {
        this.reaction('Fire ring same cost characters')
            .when({
                onCardDishonored: (event: EventPayload<EventName.OnCardDishonored>, context) => {
                    const dishonoredByYourEffect = context.player === event.context?.player;
                    const dishonoredByRingEffect = event.context?.source instanceof Ring;
                    const currentlyFire = this.getCurrentElementSymbol(elementKey) === Element.Fire;
                    return dishonoredByYourEffect && dishonoredByRingEffect && currentlyFire;
                },
                onCardHonored: (event: EventPayload<EventName.OnCardHonored>, context) => {
                    const honoredByYourEffect = context.player === event.context?.player;
                    const honoredByRingEffect = event.context?.source instanceof Ring;
                    const currentlyFire = this.getCurrentElementSymbol(elementKey) === Element.Fire;
                    return honoredByYourEffect && honoredByRingEffect && currentlyFire;
                }
            })
            .gameAction(AbilityDsl.actions.conditional((context) => ({
                condition: context.event.name === EventName.OnCardDishonored,
                trueGameAction: AbilityDsl.actions.dishonor({
                    target: this.getTsukeTargets(context.event.card)
                }),
                falseGameAction: AbilityDsl.actions.honor({
                    target: this.getTsukeTargets(context.event.card)
                })
            })));
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
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Ring Effect',
            element: Element.Fire
        });
        return symbols;
    }
}


export default IsawaTsuke;
