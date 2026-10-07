import DrawCard from '../../DrawCard.js';
import { perRound } from '../../AbilityLimit.js';
import { Element } from '../../Constants.js';
import { claimedRingSymbols, hasClaimedRing } from '../claimedRings.js';

const elementSymbol = { key: 'stride-the-waves-water', element: Element.Water };

class StrideTheWaves extends DrawCard {
    static id = 'stride-the-waves';

    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true
        });

        this.action('Move attached character in or out of the conflict')
            .condition(context => context.game.isDuringConflict() && hasClaimedRing(this, elementSymbol.key, context.player))
            .if(context => !!context.source.parentCharacter?.inConflict)
                .sendHome(context => ({ target: context.source.parentCharacter ?? [] }))
            .otherwise()
                .moveToConflict(context => ({ target: context.source.parentCharacter ?? [] }))
            .effect('{3} {1} {2}', context => {
                const parent = context.source.parentCharacter;
                return [
                    parent ?? '',
                    parent && parent.inConflict ? 'home' : 'into the conflict',
                    parent && parent.inConflict ? 'send' : 'move'
                ];
            })
            .limit(perRound(2));
    }

    getPrintedElementSymbols() {
        return [...super.getPrintedElementSymbols(), ...claimedRingSymbols([elementSymbol])];
    }
}


export default StrideTheWaves;
