import DrawCard from '../../DrawCard.js';
import { Phases, CardTypes, Locations } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class EtherealAlignment extends DrawCard {
    static id = 'ethereal-alignment';

    setupCardAbilities() {
        this.interrupt({
            title: 'Restore a province',
            when : {
                onPhaseEnded: event => event.phase === Phases.Conflict
            },
            target: {
                location: Locations.Provinces,
                cardType: CardTypes.Province,
                cardCondition: (card, context) => {
                    return card.isBroken && card.element.some((element: any) => {
                        if(element === 'all') {
                            return true;
                        }
                        return this.game.rings[element].isConsideredClaimed(context.player);
                    });
                },
                gameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.restoreProvince(),
                    AbilityDsl.actions.moveCard(context => ({
                        target: context.source,
                        destination: Locations.RemovedFromGame
                    }))
                ])
            },
            effect: 'restore {0}'
        });
    }
}


export default EtherealAlignment;
