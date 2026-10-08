import DrawCard from '../../DrawCard.js';
import { Phase, CardType, Location } from '../../Constants.js';
import { moveCard, multiple, restoreProvince } from '../../GameActions/GameActions.js';

class EtherealAlignment extends DrawCard {
    static id = 'ethereal-alignment';

    setupCardAbilities() {
        this.interrupt('Restore a province')
            .when({
                onPhaseEnded: (event) => event.phase === Phase.Conflict
            })
            .target({
                location: Location.Provinces,
                cardType: CardType.Province,
                cardCondition: (card, context) => {
                    return card.isBroken && card.element.some((element: string) => {
                        if(element === 'all') {
                            return true;
                        }
                        return this.game.ringFor(element)?.isConsideredClaimed(context.player) ?? false;
                    });
                }
            }, multiple([
                restoreProvince(),
                moveCard((context) => ({
                    target: context.source,
                    destination: Location.RemovedFromGame
                }))
            ]))
            .chatText('restore {0}');
    }
}


export default EtherealAlignment;
