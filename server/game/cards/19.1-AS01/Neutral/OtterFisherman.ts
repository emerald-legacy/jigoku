import { Element, EventName, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

import type { EventPayload } from '../../../Events/EventPayloads.js';
const ELEMENT_KEY = 'otter-fisherman-water';

export default class OtterFisherman extends DrawCard {
    static id = 'otter-fisherman';

    public setupCardAbilities() {
        this.persistentEffect({
            effect: [AbilityDsl.effects.immunity({ restricts: 'creature' })]
        });

        this.reaction('Gain resource after claiming water')
            .when({
                onClaimRing: (event: EventPayload<EventName.OnClaimRing>, context) =>
                    event.player === context.player &&
                    ((event.conflict && event.conflict.hasElement(this.getCurrentElementSymbol(ELEMENT_KEY))) ||
                        event.ring.hasElement(this.getCurrentElementSymbol(ELEMENT_KEY)))
            })
            .select('target', {
                player: Players.Opponent,
                activePromptTitle: 'Choose an option for your opponent'
            }, {
                'Opponent gains 1 fate': AbilityDsl.actions.gainFate((context) => ({
                    target: context.source.controller,
                    amount: 1
                })),
                'Opponent gains 1 honor': AbilityDsl.actions.gainHonor((context) => ({
                    target: context.source.controller,
                    amount: 1
                })),
                'Opponent draws 1 card': AbilityDsl.actions.draw((context) => ({
                    target: context.source.controller,
                    amount: 1
                }))
            });
    }

    public getPrintedElementSymbols() {
        const symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: ELEMENT_KEY,
            prettyName: 'Ring',
            element: Element.Water
        });
        return symbols;
    }
}
