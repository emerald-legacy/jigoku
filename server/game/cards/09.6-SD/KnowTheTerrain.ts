import DrawCard from '../../drawcard.js';
import { CardTypes, Players, Locations } from '../../Constants.js';
import type { TriggeredAbilityContext } from '../../TriggeredAbilityContext.js';

class KnowTheTerrain extends DrawCard {
    static id = 'know-the-terrain';

    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Switch the attacked province with a facedown province',
            effect: 'switch the attacked province card',
            when: {
                onConflictDeclaredBeforeProvinceReveal: (event: any, context: TriggeredAbilityContext) => event.conflict.conflictProvince.isFacedown() &&
                    event.conflict.defendingPlayer === context.player &&
                    event.conflict.conflictProvince.location !== Locations.StrongholdProvince
            },
            handler: (context?: TriggeredAbilityContext) => {
                if(!context) {
                    return;
                }
                return this.game.promptForSelect(context.player, {
                    activePromptTitle: 'Choose an unbroken province',
                    cardType: CardTypes.Province,
                    context: context,
                    location: Locations.Provinces,
                    controller: Players.Self,
                    cardCondition: (card: any, innerContext: any) => card.location !== Locations.StrongholdProvince && !card.isBroken && card.isFacedown() && card !== innerContext.event.conflict.conflictProvince,
                    onSelect: (player: any, card: any) => {
                        let attackedprovince = context.event.conflict.conflictProvince;
                        let chosenProvince = card;
                        let attackedLocation = attackedprovince.location;
                        let chosenLocation = chosenProvince.location;
                        context.player.moveCard(attackedprovince, chosenLocation);
                        context.player.moveCard(chosenProvince, attackedLocation);

                        chosenProvince.inConflict = true;
                        context.event.conflict.conflictProvince.inConflict = false;
                        context.event.conflict.conflictProvince = chosenProvince;
                        return true;
                    }
                });
            }
        });
    }
}


export default KnowTheTerrain;
