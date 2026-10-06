import DrawCard from '../../DrawCard.js';
import { Location, CardType, Players, Element } from '../../Constants.js';
import { playCard } from '../../GameActions/GameActions.js';
import { claimedRingSymbols, hasClaimedRing } from '../claimedRings.js';

const elementSymbol = { key: 'inventive-mirumoto-water', element: Element.Water };

class InventiveMirumoto extends DrawCard {
    static id = 'inventive-mirumoto';

    setupCardAbilities() {
        this.action('Play attachment onto this character')
            .condition(context => hasClaimedRing(this, elementSymbol.key, context.player))
            .target({
                cardCondition: card => card.type === CardType.Attachment,
                location: Location.ConflictDiscardPile,
                controller: Players.Self
            }, playCard(context => ({
                payCosts: true,
                source: this,
                playCardTarget: attachContext => {
                    attachContext.target = context.source;
                    attachContext.targets.target = context.source;
                }

            })))
            .effect('play {0} onto {1}', context => [context.target, context.source]);
    }

    getPrintedElementSymbols() {
        return [...super.getPrintedElementSymbols(), ...claimedRingSymbols([elementSymbol])];
    }
}


export default InventiveMirumoto;
