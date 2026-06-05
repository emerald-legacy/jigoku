import DrawCard from '../../DrawCard.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import { Phases, CardType, Location } from '../../Constants.js';
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
                location: Location.Provinces,
                cardType: CardType.Province,
                cardCondition: (card, context) => {
                    const province = card as ProvinceCard;
                    return province.isBroken && province.element.some((element: string) => {
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
                        destination: Location.RemovedFromGame
                    }))
                ])
            },
            effect: 'restore {0}'
        });
    }
}


export default EtherealAlignment;
