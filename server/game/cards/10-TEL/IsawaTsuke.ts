import DrawCard from '../../DrawCard.js';
import type { TriggeredAbilityContext } from '../../TriggeredAbilityContext.js';
import type { AbilityContext } from '../../AbilityContext.js';
import AbilityDsl from '../../abilitydsl.js';
import { Elements, EventNames } from '../../Constants.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
const elementKey = 'isawa-tsuke-fire';

class IsawaTsuke extends DrawCard {
    static id = 'isawa-tsuke';

    setupCardAbilities() {
        this.reaction({
            title: 'Fire ring same cost characters',
            when: {
                onCardDishonored: (event: EventPayload<EventNames.OnCardDishonored>, context) => {
                    const dishonoredByYourEffect = context.player === event.context?.player;
                    const dishonoredByRingEffect = event.context?.source.type === 'ring';
                    const currentlyFire = this.getCurrentElementSymbol(elementKey) === Elements.Fire;
                    return dishonoredByYourEffect && dishonoredByRingEffect && currentlyFire;
                },
                onCardHonored: (event: EventPayload<EventNames.OnCardHonored>, context) => {
                    const honoredByYourEffect = context.player === event.context?.player;
                    const honoredByRingEffect = event.context?.source.type === 'ring';
                    const currentlyFire = this.getCurrentElementSymbol(elementKey) === Elements.Fire;
                    return honoredByYourEffect && honoredByRingEffect && currentlyFire;
                }
            },
            gameAction: AbilityDsl.actions.conditional((context) => ({
                condition: (context as TriggeredAbilityContext).event.name === EventNames.OnCardDishonored,
                trueGameAction: AbilityDsl.actions.dishonor({
                    target: this.getTsukeTargets(context)
                }),
                falseGameAction: AbilityDsl.actions.honor({
                    target: this.getTsukeTargets(context)
                })
            }))
        });
    }
    getTsukeTargets(context: AbilityContext) {
        let targetedCharacter = (context as TriggeredAbilityContext).event.card as DrawCard;
        let targetedCharacterController = ((context as TriggeredAbilityContext).event.card as DrawCard).controller;

        return targetedCharacterController.cardsInPlay.filter(
            (card: any) => card.printedCost === targetedCharacter.printedCost
        );
    }

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Ring Effect',
            element: Elements.Fire
        });
        return symbols;
    }
}


export default IsawaTsuke;
