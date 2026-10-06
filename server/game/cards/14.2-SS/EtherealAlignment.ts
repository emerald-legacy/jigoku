import DrawCard from '../../DrawCard.js';
import { Phases, CardType, Location } from '../../Constants.js';
import { moveCard, multiple, restoreProvince } from '../../GameActions/GameActions.js';

class EtherealAlignment extends DrawCard {
    static id = 'ethereal-alignment';

    setupCardAbilities() {
        this.interrupt('Restore a province')
            .when({
                onPhaseEnded: event => event.phase === Phases.Conflict
            })
            .target({
                location: Location.Provinces,
                cardType: CardType.Province,
                cardCondition: (card, context) => {
                    return card.isBroken && card.element.some((element: string) => {
                        if(element === 'all') {
                            return true;
                        }
                        return this.game.rings[element].isConsideredClaimed(context.player);
                    });
                }
            }, multiple([
                restoreProvince(),
                moveCard(context => ({
                    target: context.source,
                    destination: Location.RemovedFromGame
                }))
            ]))
            .effect('restore {0}');
    }
}


export default EtherealAlignment;
