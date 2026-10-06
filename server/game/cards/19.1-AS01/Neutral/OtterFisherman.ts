import { Element, Players } from '../../../Constants.js';
import { immunity } from '../../../effects.js';
import { draw, gainFate, gainHonor } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import { claimsRingOf } from '../../claimedRings.js';

const ELEMENT_KEY = 'otter-fisherman-water';

export default class OtterFisherman extends DrawCard {
    static id = 'otter-fisherman';

    public setupCardAbilities() {
        this.persistentEffect({
            effect: [immunity({ restricts: 'creature' })]
        });

        this.reaction('Gain resource after claiming water')
            .when({
                onClaimRing: (event, context) => event.player === context.player && claimsRingOf(this, ELEMENT_KEY, event)
            })
            .select({
                player: Players.Opponent,
                activePromptTitle: 'Choose an option for your opponent'
            }, {
                'Opponent gains 1 fate': gainFate((context) => ({
                    target: context.source.controller
                })),
                'Opponent gains 1 honor': gainHonor((context) => ({
                    target: context.source.controller
                })),
                'Opponent draws 1 card': draw((context) => ({
                    target: context.source.controller
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
