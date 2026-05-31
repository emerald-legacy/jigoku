import DrawCard from '../../DrawCard.js';
import { CardTypes, EventNames, Players, Locations } from '../../Constants.js';
import type { TriggeredAbilityContext } from '../../TriggeredAbilityContext.js';
import type { EventPayload } from '../../Events/EventPayloads.js';

class KnowTheTerrain extends DrawCard {
    static id = 'know-the-terrain';

    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Switch the attacked province with a facedown province',
            effect: 'switch the attacked province card',
            when: {
                onConflictDeclaredBeforeProvinceReveal: (event: EventPayload<EventNames.OnConflictDeclaredBeforeProvinceReveal>, context: TriggeredAbilityContext) => !!event.conflict.conflictProvince && event.conflict.conflictProvince.isFacedown() &&
                    event.conflict.defendingPlayer === context.player &&
                    event.conflict.conflictProvince.location !== Locations.StrongholdProvince
            },
            handler: (context: TriggeredAbilityContext) => {
                const conflict = context.event.conflict;
                if(!conflict) {
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
                        let attackedprovince = conflict.conflictProvince;
                        if(!attackedprovince) {
                            return true;
                        }
                        let chosenProvince = card;
                        let attackedLocation = attackedprovince.location;
                        let chosenLocation = chosenProvince.location;
                        context.player.moveCard(attackedprovince, chosenLocation);
                        context.player.moveCard(chosenProvince, attackedLocation);

                        chosenProvince.inConflict = true;
                        attackedprovince.inConflict = false;
                        conflict.conflictProvince = chosenProvince;
                        return true;
                    }
                });
            }
        });
    }
}


export default KnowTheTerrain;
