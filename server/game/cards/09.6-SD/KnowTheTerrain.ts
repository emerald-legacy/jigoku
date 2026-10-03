import DrawCard from '../../DrawCard.js';
import { CardType, Players, Location } from '../../Constants.js';

class KnowTheTerrain extends DrawCard {
    static id = 'know-the-terrain';

    setupCardAbilities() {
        this.wouldInterrupt('Switch the attacked province with a facedown province')
            .when({
                onConflictDeclaredBeforeProvinceReveal: (event, context) => !!event.conflict.conflictProvince && event.conflict.conflictProvince.isFacedown() &&
                    event.conflict.defendingPlayer === context.player &&
                    event.conflict.conflictProvince.location !== Location.StrongholdProvince
            })
            .handler((context) => {
                const conflict = context.event.conflict;
                this.game.promptForSelect(context.player, {
                    activePromptTitle: 'Choose an unbroken province',
                    cardType: CardType.Province,
                    context: context,
                    location: Location.Provinces,
                    controller: Players.Self,
                    cardCondition: (card) => card.location !== Location.StrongholdProvince && !card.isBroken && card.isFacedown() && card !== conflict.conflictProvince,
                    onSelect: (_player, chosenProvince) => {
                        const attackedProvince = conflict.conflictProvince;
                        if(!attackedProvince) {
                            return true;
                        }
                        const attackedLocation = attackedProvince.location;
                        const chosenLocation = chosenProvince.location;
                        context.player.moveCard(attackedProvince, chosenLocation);
                        context.player.moveCard(chosenProvince, attackedLocation);

                        chosenProvince.inConflict = true;
                        attackedProvince.inConflict = false;
                        conflict.conflictProvince = chosenProvince;
                        return true;
                    }
                });
            })
            .effect('switch the attacked province card');
    }
}


export default KnowTheTerrain;
